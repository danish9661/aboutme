import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { Eyebrow } from "@/components/Section";
import Badge from "@/components/Badge";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "ArbFlow — Multi-tenant GA4 analytics SaaS",
  description:
    "Case study: secure per-client workspaces, per-tenant data isolation, and a dashboard that surfaces what actually changed across GA4, Meta and LinkedIn. Live in production.",
};

const PALETTE = ["#ff4e9b", "#845ec2", "#e2563b", "#d98324"];
const WASHES = [
  "rgba(255,78,155,0.10)",
  "rgba(132,94,194,0.12)",
  "rgba(255,107,107,0.12)",
  "rgba(255,179,71,0.16)",
];

const STACK_PILLS = [
  { label: "Next.js", color: "#ff4e9b", wash: "rgba(255,78,155,0.12)" },
  { label: "FastAPI", color: "#845ec2", wash: "rgba(132,94,194,0.13)" },
  { label: "PostgreSQL", color: "#e2563b", wash: "rgba(255,107,107,0.14)" },
  { label: "JWT", color: "#d98324", wash: "rgba(255,179,71,0.18)" },
  { label: "Vercel", color: "#5a5a5f", wash: "rgba(90,90,95,0.08)" },
];

const AT_A_GLANCE = [
  // TODO: confirm role / timeline if you want them exact
  { key: "ROLE", value: "Solo — design, frontend, backend, infra" },
  { key: "STACK", value: "Next.js · FastAPI · PostgreSQL · Vercel" },
  { key: "FOR", value: "Marketing agencies managing many clients" },
  { key: "STATUS", value: "Live in production" },
];

const ARCHITECTURE = [
  {
    key: "DASHBOARD",
    value: "Next.js on Vercel (App Router) — the agency-facing UI and per-client views.",
  },
  {
    key: "API",
    value:
      "FastAPI service — authentication, the GA4 / Meta / LinkedIn OAuth connectors, and metric aggregation.",
  },
  {
    key: "DATA",
    value: "PostgreSQL — every row tagged by tenant; reads and writes are tenant-scoped.",
  },
  {
    key: "CONNECTORS",
    value: "GA4, Meta and LinkedIn pulled via OAuth on a schedule, then normalised.",
    // TODO: confirm scheduling/normalisation specifics
  },
];

const SECURITY = [
  "Per-tenant data isolation: every record is tied to a tenant and every query is scoped to the caller's tenant, so one workspace can never read another's data.",
  "Scoped workspaces with role-based access — members only ever see the clients they're granted.",
  "Third-party OAuth tokens are held server-side and never exposed to the browser.",
  "Least-privilege OAuth scopes against GA4 / Meta / LinkedIn.",
  // TODO (confirm the real mechanisms so this is exact):
  //  - tenant isolation: Postgres Row-Level Security vs application-layer scoping?
  //  - token storage: encrypted at rest? which KMS/secret store?
  //  - session/auth: how sessions + tenant claims are issued and verified
];

/** Gradient-topped fact card with colour-dotted keys. */
function FactCard({ rows }: { rows: { key: string; value: string }[] }) {
  return (
    <dl className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_18px_50px_-24px_rgba(132,94,194,0.35)]">
      <div className="bg-candy h-1.5 w-full" aria-hidden />
      {rows.map((h, i) => (
        <div
          key={h.key}
          className={`grid grid-cols-1 gap-2 px-6 py-5 sm:grid-cols-[170px_1fr] sm:gap-6 ${
            i % 2 === 1 ? "bg-bg" : ""
          }`}
        >
          <dt className="flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em]">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: PALETTE[i % PALETTE.length] }}
              aria-hidden
            />
            <span style={{ color: PALETTE[i % PALETTE.length] }}>{h.key}</span>
          </dt>
          <dd className="text-[15px] leading-relaxed text-ink">{h.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function ArbFlowCaseStudy() {
  return (
    <article className="relative mx-auto w-full max-w-page px-6 py-16 sm:px-8 sm:py-24">
      {/* vibrant header backdrop: gradient blobs + dotted pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] overflow-hidden"
      >
        <div className="absolute -left-24 -top-20 h-80 w-80 rounded-full bg-accent-wash blur-3xl" />
        <div className="absolute right-0 -top-10 h-72 w-72 rounded-full bg-accent-2-wash blur-3xl" />
        <div className="absolute left-1/3 top-44 h-64 w-64 rounded-full bg-accent-3-wash blur-3xl" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(132,94,194,0.12) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "linear-gradient(to bottom, black, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />
      </div>

      <Link
        href="/#work"
        className="font-mono text-[13px] text-ink-2 transition-colors hover:text-accent"
      >
        ← Back to work
      </Link>

      {/* header */}
      <div className="relative mt-8">
        {/* floating ArbFlow-style badges (desktop) */}
        <span
          className="pointer-events-none absolute right-2 top-8 hidden rotate-3 items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[12px] font-medium shadow-md lg:inline-flex"
          style={{ background: "rgba(255,107,107,0.16)", color: "#e2563b" }}
        >
          ● GA4 synced
        </span>
        <span
          className="pointer-events-none absolute right-20 top-28 hidden -rotate-3 rounded-full px-3 py-1.5 font-mono text-[12px] font-medium shadow-md lg:inline-block"
          style={{ background: "rgba(132,94,194,0.16)", color: "#845ec2" }}
        >
          🔒 per-tenant
        </span>

        <div className="flex flex-wrap items-center gap-3">
          <Eyebrow>Case study</Eyebrow>
          <Badge label="Live" variant="live" pulse />
        </div>

        <h1
          style={{ viewTransitionName: "project-title-arbflow" }}
          className="mt-5 text-[44px] font-semibold leading-[1.02] tracking-tightest sm:text-[60px]"
        >
          <span className="text-candy">ArbFlow</span>
        </h1>

        <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-ink-2">
          Multi-tenant GA4 analytics SaaS for agencies — secure per-client
          workspaces, per-tenant data isolation, and a dashboard that unifies GA4,
          Meta and LinkedIn and tells you what actually changed. Deployed and
          running in production.
        </p>

        {/* colourful tech pills */}
        <div className="mt-7 flex flex-wrap gap-2.5">
          {STACK_PILLS.map((p, i) => (
            <span
              key={p.label}
              className="rounded-full px-3.5 py-1.5 font-mono text-[12px] font-medium shadow-sm"
              style={{
                background: p.wash,
                color: p.color,
                transform: i % 2 === 0 ? "rotate(-1.5deg)" : "rotate(1.5deg)",
              }}
            >
              {p.label}
            </span>
          ))}
        </div>
      </div>

      {/* At a glance */}
      <div className="mt-12">
        <FactCard rows={AT_A_GLANCE} />
      </div>

      {/* Problem */}
      <section className="mt-16">
        <Eyebrow>The problem</Eyebrow>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-2">
          Agencies juggle every client&apos;s analytics across GA4, Meta and
          LinkedIn — separate logins, exported CSVs, and still no clear answer to
          the only question that matters before a client call: what actually
          changed this week, and why? There was no single, secure place to see
          per-client performance and have the notable shifts surfaced for you.
        </p>
      </section>

      {/* What it does */}
      <section className="mt-14">
        <Eyebrow>What it does</Eyebrow>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-2">
          ArbFlow gives an agency one isolated workspace per client. Connect a
          client&apos;s GA4, Meta and LinkedIn in a few clicks and ArbFlow unifies
          the data into a clean dashboard — then surfaces what moved: traffic
          shifts, funnel spikes, pages worth a look. You walk into the client
          call already knowing the story.
        </p>
      </section>

      {/* Architecture */}
      <section className="mt-14">
        <Eyebrow>Architecture</Eyebrow>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-2">
          A Next.js dashboard on Vercel talks to a FastAPI backend, which owns
          auth, the OAuth connectors, and aggregation over a tenant-scoped
          PostgreSQL database.
        </p>
        <div className="mt-6">
          <FactCard rows={ARCHITECTURE} />
        </div>
        <p className="mt-4 font-mono text-[12px] text-ink-3">
          browser <span className="text-accent">→</span> Next.js (Vercel){" "}
          <span className="text-accent-2">→</span> FastAPI{" "}
          <span className="text-coral">→</span> PostgreSQL · connectors pull GA4 /
          Meta / LinkedIn on a schedule
        </p>
      </section>

      {/* Security & multi-tenancy */}
      <section className="mt-14">
        <Eyebrow>Security &amp; multi-tenancy</Eyebrow>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-2">
          Multi-tenancy is the whole product, so isolation is a first-class
          concern rather than an afterthought. The decisions that mattered:
        </p>
        <ul className="mt-6 grid max-w-3xl gap-3 sm:grid-cols-2">
          {SECURITY.map((s, i) => (
            <li
              key={s}
              className="flex gap-3 rounded-xl border p-4 text-[15px] leading-relaxed text-ink"
              style={{
                background: WASHES[i % WASHES.length],
                borderColor: PALETTE[i % PALETTE.length] + "33",
              }}
            >
              <span
                className="mt-0.5 shrink-0"
                style={{ color: PALETTE[i % PALETTE.length] }}
                aria-hidden
              >
                ∿
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Status */}
      <section className="mt-14">
        <Eyebrow>Status</Eyebrow>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-2">
          Live in production on Vercel. Try the connect flow and dashboard
          yourself, or ask me about any of the decisions above.
        </p>
      </section>

      <div className="mt-12 flex flex-wrap items-center gap-3">
        <Button href="https://marketing-saas-platform-pi.vercel.app/">
          Visit live demo →
        </Button>
        <Button href="mailto:9661346164h@gmail.com" variant="outline">
          Ask me about it
        </Button>
      </div>
    </article>
  );
}
