import PostLayout from "@/components/blog/PostLayout";
import AuthFlowDiagram, { type FlowStep } from "@/components/blog/AuthFlowDiagram";
import CodeBlock from "@/components/blog/CodeBlock";
import { postMetadata } from "@/lib/posts";

export const metadata = postMetadata("jwts-in-redirect-urls");

const BEFORE_STEPS: FlowStep[] = [
  { from: "Browser", to: "Google", label: "Sign in with Google" },
  { from: "Google", to: "Browser", label: "Redirect to backend callback (Google code)" },
  { from: "Browser", to: "Backend", label: "GET /integrations/google/callback?code=googleCode" },
  { from: "Backend", to: "Google", label: "Exchange code for tokens + userinfo" },
  { from: "Google", to: "Backend", label: "Access token + profile" },
  { from: "Backend", to: "Backend", label: "Find / create user, mint session JWT" },
  {
    from: "Backend",
    to: "Browser",
    label: "302 Redirect → /dashboard?token=eyJhbGci…JWT",
    highlight: "danger",
    tag: "JWT in URL",
  },
  {
    from: "Browser",
    to: "Frontend",
    label: "GET /dashboard?token=eyJhbGci…JWT",
    note: "JWT is now in the URL — browser history · server & proxy logs · Referer header",
    highlight: "danger",
    tag: "JWT in URL",
  },
  { from: "Frontend", to: "Frontend", label: "Read token from URL, store it" },
];

const AFTER_STEPS: FlowStep[] = [
  { from: "Browser", to: "Google", label: "Sign in with Google" },
  { from: "Google", to: "Browser", label: "Redirect to backend callback (Google code)" },
  { from: "Browser", to: "Backend", label: "GET /integrations/google/callback?code=googleCode" },
  { from: "Backend", to: "Google", label: "Exchange code for tokens + userinfo" },
  { from: "Google", to: "Backend", label: "Access token + profile" },
  {
    from: "Backend",
    to: "Backend",
    label:
      "Find / create user, mint session JWT, generate random auth_code, store sha256(auth_code) + JWT · TTL 120s",
  },
  { from: "Backend", to: "Browser", label: "302 Redirect → /dashboard?auth_code=…" },
  {
    from: "Browser",
    to: "Frontend",
    label: "GET /dashboard?auth_code=…",
    note: "Only a single-use, 120s, hashed claim ticket is in the URL",
  },
  {
    from: "Frontend",
    to: "Backend",
    label: "POST /api/v1/auth/exchange { code }",
    note: "Atomic delete-and-return by code hash; exactly one caller wins, then check expiry",
  },
  {
    from: "Backend",
    to: "Frontend",
    label: "200 { access_token: JWT } — in response body",
    highlight: "success",
    tag: "JWT in body",
  },
  { from: "Frontend", to: "Frontend", label: "Store JWT, strip ?auth_code from URL" },
];

const CALLBACK_PY = `# Mint the session JWT, but hand the browser a single-use code instead
# of the token itself so the JWT never lands in a URL / history / logs.
expire = datetime.utcnow() + timedelta(hours=24)
jwt_token = jwt.encode({"sub": str(user.id), "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)
auth_code = create_auth_code(db, jwt_token)

return RedirectResponse(url=f"{FRONTEND_URL}/dashboard?auth_code={auth_code}&integration=success")`;

const CREATE_PY = `def _hash_code(code: str) -> str:
    """Auth codes are stored hashed, like passwords: a leaked DB row must not
    be redeemable for a session token. sha256 is fine here — the input is a
    256-bit random value, so there's nothing to brute-force."""
    return hashlib.sha256(code.encode("utf-8")).hexdigest()


def create_auth_code(db: Session, token: str) -> str:
    """Persist a JWT behind a fresh single-use code and return the code.

    Only the sha256 of the code touches the database; the plaintext code goes
    to the browser once, in the redirect URL, and is never stored.
    """
    code = secrets.token_urlsafe(32)
    db.add(AuthCode(code=_hash_code(code), token=token))
    db.commit()
    return code`;

const EXCHANGE_PY = `@router.post("/exchange")
def exchange_auth_code(payload: AuthCodeExchange, request: Request, db: Session = Depends(get_db)):
    """Exchange a single-use OAuth \`auth_code\` for the session JWT.

    Keeps the long-lived token out of the redirect URL: the callback hands the
    browser an opaque code, and the frontend trades it here for the real token.
    """
    enforce_rate_limit(request, "exchange")
    token = consume_auth_code(db, payload.code)
    if not token:
        raise HTTPException(status_code=400, detail="Invalid or expired code")
    return {"access_token": token, "token_type": "bearer"}`;

const CONSUME_PY = `def consume_auth_code(db: Session, code: str) -> str | None:
    """Atomically claim a single-use code and return its JWT (or None)."""
    row = db.execute(
        delete(AuthCode)
        .where(AuthCode.code == _hash_code(code))
        .returning(AuthCode.token, AuthCode.created_at)
    ).first()
    db.commit()

    if row is None:
        return None

    token, created_at = row
    cutoff = datetime.utcnow() - timedelta(seconds=AUTH_CODE_TTL_SECONDS)
    return None if created_at < cutoff else token`;

const FRONTEND_TS = `// Module-level: dedupes the single-use code across React's double-invokes.
let pending: { code: string; promise: Promise<boolean> } | null = null;

async function exchange(code: string): Promise<boolean> {
  const res = await fetch(\`\${getApiUrl()}/api/v1/auth/exchange\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) return false;

  const data = await res.json();
  if (!data.access_token) return false;

  localStorage.setItem("token", data.access_token);

  // Remove the (now-spent) code from the URL + history, keep other params.
  const params = new URLSearchParams(window.location.search);
  params.delete("auth_code");
  const query = params.toString();
  window.history.replaceState({}, "", window.location.pathname + (query ? \`?\${query}\` : ""));
  return true;
}

// After Google sign-in, the backend redirects with a single-use \`?auth_code=\`.
export async function consumeAuthCode(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const code = new URLSearchParams(window.location.search).get("auth_code");
  if (!code) return false;

  // React can mount the auth guard twice (Strict Mode), and the code is
  // single-use — so dedupe: reuse the in-flight promise for the same code
  // instead of spending an already-consumed code on the second call.
  if (pending && pending.code === code) return pending.promise;

  const promise = exchange(code);
  pending = { code, promise };
  return promise;
}`;

const DONT_PY = `# DON'T do this — the JWT is now in the URL.
return RedirectResponse(
    url=f"{FRONTEND_URL}/dashboard?token={jwt_token}"
)`;

export default function Post() {
  return (
    <PostLayout slug="jwts-in-redirect-urls">
      <p>
        <em>
          A small auth decision from building ArbFlow, and the reasoning behind
          it.
        </em>
      </p>

      <hr />

      <h2>TL;DR</h2>
      <p>
        When you finish an OAuth login, the tempting move is to redirect the
        browser back to your app with the session token in the URL:{" "}
        <code>myapp.com/callback?token=eyJhbGci...</code>. It works on the first
        try, which is exactly why it&apos;s dangerous. URLs leak — into browser
        history, server logs, and <code>Referer</code> headers. So instead of
        handing back the token, I hand back a{" "}
        <strong>single-use, short-lived, hashed authorization code</strong>, and
        the frontend exchanges it for the real token over a POST. It&apos;s the
        same reasoning that killed OAuth&apos;s implicit flow, applied to the
        last hop of my own login.
      </p>

      <hr />

      <h2>The shortcut that works (and why that&apos;s the trap)</h2>
      <p>
        Here&apos;s the flow I needed in ArbFlow: user signs in with Google, my
        backend verifies them and mints an ArbFlow session JWT, and the frontend
        (a separate origin on Vercel) needs to end up holding that JWT.
      </p>
      <p>
        The obvious wiring is to redirect the browser from my backend callback
        straight to the frontend with the token in the query string. In
        ArbFlow&apos;s shape, the &ldquo;don&apos;t do this&rdquo; version looks
        like this:
      </p>
      <CodeBlock lang="python" code={DONT_PY} />
      <p>
        The frontend reads <code>token</code> from the URL, drops it in storage,
        done. It works the first time you test it. No error, no friction. And
        because it works, it&apos;s easy to never think about it again.
      </p>
      <p>
        The problem is that a JWT is a <strong>bearer token</strong> — whoever
        holds it <em>is</em> the user until it expires. And a URL is one of the
        least private places you can put a secret.
      </p>

      <hr />

      <h2>Where URLs leak</h2>
      <AuthFlowDiagram
        caption="The before picture — the red hops are where the JWT sits in the URL."
        steps={BEFORE_STEPS}
      />
      <p>Four channels, all of them boring and all of them real:</p>
      <p>
        <strong>Browser history.</strong> The full URL, query string included,
        gets written to history. Anyone with access to that machine can scroll
        back and read the token. Shared or public computers make this worse.
      </p>
      <p>
        <strong>Server and infrastructure logs.</strong> Access logs across web
        servers, reverse proxies, load balancers, and CDNs routinely record the
        request line — which includes the query string. Your token is now
        sitting in plaintext in log files you may not even own, possibly shipped
        to a third-party logging service.
      </p>
      <p>
        <strong>
          The <code>Referer</code> header.
        </strong>{" "}
        When the callback page loads and makes any request to another origin,
        the browser can attach the current URL — token and all — as the{" "}
        <code>Referer</code>. Modern browsers default to{" "}
        <code>strict-origin-when-cross-origin</code>, which strips the path and
        query on cross-origin requests, so this is <em>mitigated</em> today — but
        &ldquo;mitigated by a default someone can override&rdquo; is not the same
        as &ldquo;safe.&rdquo;
      </p>
      <p>
        <strong>Humans.</strong> URLs live in the address bar. People copy them,
        paste them into chats, bookmark them, screenshot them. A token in the
        URL rides along every time.
      </p>
      <p>
        Putting a fragment (<code>#token=...</code>) instead of a query param
        dodges the server-log problem, since fragments aren&apos;t sent to the
        server. This is exactly what OAuth&apos;s old{" "}
        <strong>implicit flow</strong> did. It&apos;s also why the implicit flow
        got deprecated — the fragment still lands in history and is still
        readable by any JavaScript on the page. Moving the leak around isn&apos;t
        fixing it.
      </p>

      <hr />

      <h2>The fix: hand back a claim ticket, not the prize</h2>
      <p>
        Instead of putting the token in the redirect, my backend puts a{" "}
        <strong>short-lived authorization code</strong> there. The frontend then
        trades that code for the real token over a normal POST request.
      </p>
      <p>The redirect carries a value that is:</p>
      <ul>
        <li>
          <strong>Single-use</strong> — consumed (in fact, deleted) the moment
          it&apos;s exchanged, so a replay from history or logs hits a dead code.
        </li>
        <li>
          <strong>Short-lived</strong> — a 120-second TTL. The window where the
          code means anything is tiny.
        </li>
        <li>
          <strong>Hashed at rest</strong> — I store <code>sha256(code)</code>,
          not the code itself. The browser holds the raw code; on exchange I
          hash the incoming value and look it up. A database dump gives an
          attacker hashes, not usable codes.
        </li>
        <li>
          <strong>Not a bearer credential for the API</strong> — even if the
          code leaks, it isn&apos;t a key to anything. It&apos;s a claim ticket
          that only works once, only for a moment, only against my exchange
          endpoint.
        </li>
      </ul>
      <p>
        The actual JWT comes back in the <strong>response body</strong> of the
        exchange call — which isn&apos;t written to browser history, isn&apos;t
        in the URL, and isn&apos;t sent as a <code>Referer</code>.
      </p>
      <AuthFlowDiagram
        caption="The after picture — only a single-use claim ticket touches the URL; the green hop is the JWT arriving in a POST body."
        steps={AFTER_STEPS}
      />
      <p>
        Here&apos;s the actual ArbFlow code. At the end of the Google callback, I
        mint the JWT but redirect with an <code>auth_code</code> instead of the
        token (<code>backend/app/api/integrations.py</code>):
      </p>
      <CodeBlock lang="python" code={CALLBACK_PY} />
      <p>
        <code>create_auth_code</code> is where &ldquo;hashed at rest&rdquo;
        happens — only the sha256 of the code is ever written to the database (
        <code>backend/app/core/oauth.py</code>):
      </p>
      <CodeBlock lang="python" code={CREATE_PY} />
      <p>
        The exchange endpoint trades a valid code for the token. There&apos;s
        nothing to brute-force here in the first place — the code is 256 bits of
        entropy, so guessing a valid one is infeasible no matter how many tries
        you get — but the endpoint is rate-limited anyway, as plain
        defense-in-depth against abuse (<code>backend/app/api/auth.py</code>):
      </p>
      <CodeBlock lang="python" code={EXCHANGE_PY} />
      <p>
        The single-use guarantee lives in <code>consume_auth_code</code> — and
        this is the part I got subtly wrong the first time, so it&apos;s worth
        slowing down on (<code>backend/app/core/oauth.py</code>):
      </p>
      <CodeBlock lang="python" code={CONSUME_PY} />
      <p>
        My first version did the obvious thing: <code>SELECT</code> the row by
        code hash, check it, then <code>DELETE</code> it — two statements. That
        reads fine and passes every single-threaded test. But
        &ldquo;single-use&rdquo; is the <em>entire</em> security value of the
        claim-ticket, and two statements aren&apos;t atomic. Under
        Postgres&apos;s default <code>READ COMMITTED</code> isolation, two
        concurrent exchanges of the same code can both run the{" "}
        <code>SELECT</code> before either commits its <code>DELETE</code> — and
        both walk away with the JWT.
      </p>
      <p>
        In this threat model that&apos;s the whole ballgame. The post&apos;s
        promise is &ldquo;sure, the code leaked into history or logs, but
        it&apos;s already spent.&rdquo; An attacker who intercepts the code and{" "}
        <em>races</em> the legitimate frontend breaks exactly that promise — and
        the client-side dedupe you&apos;ll see below does nothing about it,
        because that only stops React from racing <em>itself</em>, not a real
        concurrent request from somewhere else.
      </p>
      <p>
        The fix is a one-liner that makes the guarantee true: consume with a
        single <code>DELETE ... RETURNING</code> instead of select-then-delete.
        The <code>DELETE</code> takes the row lock, so exactly one caller gets
        the row back; the loser re-reads under <code>READ COMMITTED</code>, finds
        nothing, and gets <code>None</code>. Expiry becomes a check on the row
        you actually claimed — no separate table-wide cleanup pass racing
        alongside the consume. (I dropped that per-request cleanup with this
        change; the rare never-exchanged code expires harmlessly and a periodic
        sweep can prune it if the table ever grows.)
      </p>
      <p>
        And the frontend reads the code out of the URL once, swaps it, stores the
        token, and scrubs the code from the address bar (
        <code>frontend/src/lib/auth.ts</code>):
      </p>
      <CodeBlock lang="ts" code={FRONTEND_TS} />
      <p>
        That last dedupe is a small real-world wrinkle worth calling out: because
        the code is genuinely single-use, React Strict Mode invoking the effect
        twice would have the second call fail on an already-spent code.
        Memoizing the in-flight promise per code makes the client resilient to
        its own double-invokes.
      </p>

      <hr />

      <h2>&ldquo;Wait — isn&apos;t this just OAuth?&rdquo;</h2>
      <p>Yes. And that&apos;s the point.</p>
      <p>
        This is the <strong>authorization code flow</strong> that OAuth 2.0
        already uses between an app and an identity provider: you don&apos;t get
        the access token in a redirect, you get a code you exchange for one. I
        ended up rebuilding that same pattern for the <em>last hop</em> — between
        my own backend callback and my own SPA — because that hop has the exact
        same problem the OAuth designers were solving.
      </p>
      <p>
        Reinventing a well-understood pattern isn&apos;t something to hide.
        Running into the problem yourself and arriving at the same answer is a
        decent sign the answer is right.
      </p>
      <ul>
        <li>
          OAuth 2.0 authorization code grant —{" "}
          <a
            href="https://datatracker.ietf.org/doc/html/rfc6749#section-4.1"
            target="_blank"
            rel="noreferrer noopener"
          >
            RFC 6749 §4.1
          </a>
        </li>
        <li>
          Why implicit flow is discouraged —{" "}
          <a
            href="https://datatracker.ietf.org/doc/html/rfc9700"
            target="_blank"
            rel="noreferrer noopener"
          >
            OAuth 2.0 Security Best Current Practice, RFC 9700
          </a>
        </li>
      </ul>

      <hr />

      <h2>The tradeoff I&apos;m not going to pretend isn&apos;t there</h2>
      <p>
        The auth-code handoff protects the token <strong>in transit</strong> —
        how it gets from my backend to my frontend. It does nothing about where
        the token lives afterward.
      </p>
      <p>
        In ArbFlow, the JWT ends up in <code>localStorage</code>. That means any
        successful XSS on my frontend can read it. The handoff closes the
        URL-leak channels; it doesn&apos;t close that one. The more complete
        answer is an <code>httpOnly</code> cookie the browser stores and JS
        can&apos;t touch — which comes with its own baggage (CSRF,{" "}
        <code>SameSite</code> behavior across my separate frontend and API
        origins, mobile clients) that I made a deliberate call to defer.
      </p>
      <p>
        So: delivery, solved and I&apos;m confident in it. Storage, a known
        tradeoff with a clear next step. I&apos;d rather write that down than
        imply the whole thing is airtight. (I keep this documented in the
        project&apos;s <code>ARCHITECTURE.md</code> and auth audit so it
        doesn&apos;t quietly get forgotten.)
      </p>

      <hr />

      <h2>Rules of thumb I took away</h2>
      <ul>
        <li>
          A URL is a <strong>public surface</strong>. History, logs, and{" "}
          <code>Referer</code> all see it. Never put a bearer credential there.
        </li>
        <li>
          If you must pass something through a redirect, pass a{" "}
          <strong>claim ticket</strong>, not the prize: single-use, short-lived,
          hashed at rest, useless on its own.
        </li>
        <li>
          Deliver the real token in a <strong>response body</strong>, never a
          URL.
        </li>
        <li>
          When your homegrown solution converges on an existing standard (here,
          the OAuth authorization code flow), that&apos;s usually confirmation,
          not coincidence.
        </li>
        <li>
          Name your remaining tradeoffs out loud. &ldquo;Delivery is solid,
          storage is a known gap&rdquo; is a stronger position than pretending
          there isn&apos;t one.
        </li>
      </ul>

      <hr />

      <p>
        <em>
          ArbFlow is the multi-tenant analytics SaaS this decision came from.
          Built by Pranav Shukla.
        </em>
      </p>
    </PostLayout>
  );
}
