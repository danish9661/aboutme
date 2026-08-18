# Project Notes — Pranav's Portfolio

Working log so any future session can pick up with full context. Last updated: 2026-06-30.

---

## 1. What this is

A personal developer portfolio for **Pranav Shukla** (CS undergrad / builder). Audience: YC / early-stage founders reading a cold email. The page's one job: make them think "this person can ship."

- **Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v3.4 · Framer Motion 11.
- **Single main page** at `/`, plus a case-study page at `/work/arbflow` and a blog at `/blog` (see §"Blog").
- **Deploy target:** Vercel (zero-config, fully static — both routes prerender).
- Mobile-first, responsive, accessible, fully respects `prefers-reduced-motion`.

### Run / build
```bash
npm install
npm run dev      # http://localhost:3000 (or next free port)
npm run build    # static export-style prerender; must stay green
```

### Real links (already wired)
- GitHub: https://github.com/PranavShukla2
- LinkedIn: https://www.linkedin.com/in/pranav-shukla-softwaredeveloper/
- ArbFlow live demo: https://marketing-saas-platform-pi.vercel.app/ (footer + `/work/arbflow`)
- Email: pranavmshukla@gmail.com

---

## 2. Design system — "Gradient Candy"

All tokens are CSS variables in `app/globals.css` (`:root`) and surfaced as Tailwind utilities in `tailwind.config.ts`. **To re-theme, edit the `:root` block only.**

| token | value | use |
|---|---|---|
| `--bg` | `#fff6f6` | page background (soft white) |
| `--surface` | `#ffffff` | cards |
| `--ink` / `--ink-2` / `--ink-3` | `#2b1b3d` / `#6b5b7b` / `#9a8caa` | text (dark→muted) |
| `--accent` / `--accent-bright` | `#ff4e9b` / `#ff6b6b` | primary pink / coral |
| `--accent-2` / `--accent-2-bright` | `#845ec2` / `#9a78d6` | purple |
| `--accent-3` | `#ffb347` | warm/yellow (notebook highlighter, ML stack) |
| `--candy` | `linear-gradient(135deg,#ff6b6b,#ff4e9b,#845ec2)` | signature gradient |
| `--term-bg` / `--term-line` | `#17121f` / `#2e2440` | terminal/dark surfaces |

Utilities added: `.bg-candy`, `.text-candy` (gradient text via background-clip), `.border-candy`.

**Fonts (next/font/google):** JetBrains Mono → `--font-mono` (labels/eyebrows/UI), Caveat → `--font-hand` (notebook handwriting). Body/display = system stack. Tailwind families: `font-sans`, `font-mono`, `font-hand`.

**Section eyebrows:** mono 11px, uppercase, `.14em` tracking, ink-3, prefixed with a teal/accent `∿` tick. No 01/02/03 numbering.

> Note: the original brief asked for an Apple-light teal biosignal theme. The user later pivoted the palette to Gradient Candy and asked for more personality. ArbFlow's own marketing site uses the same pink/purple + cute-mascot direction, so the palette is on-brand.

---

## 3. File map

```
app/
  layout.tsx          root: fonts, sticky header (ScrollProgress + Nav), Footer, metadata, skip link
  page.tsx            main page assembly + STACK/FACTS data + section markup
  globals.css         tokens, keyframes, utilities
  work/arbflow/page.tsx   ArbFlow case study (uses Eyebrow, Badge, Chip)
components/
  Hero.tsx            hero: status pill, H1 (candy "signal"), lede, CTAs, Avatar3D
  Avatar3D.tsx        articulated SVG avatar (rig animates via CSS), speech bubble
  ScrollProgress.tsx  thin candy gradient scroll bar + glowing leading node (top of header)
  LaptopShowcase.tsx  the big interactive MacBook (see §4)
  CricketSix.tsx      scroll-driven straight-six animation (see §4)
  Notebook.tsx        spiral notebook, handwriting "field notes" (Daniel Sun inspired)
  PhoneMockup.tsx     realistic phone showing ArbFlow dashboard (About section)
  ProjectCard.tsx     work card: gradient glyph tile, badge, chips, link
  FeatureCard.tsx     Sleep Apnea featured card w/ dark "live inference" ECG demo panel
  Section.tsx         section wrapper + Eyebrow; renders Divider at top
  Divider.tsx         full-bleed candy gradient hairline + centered ∿ tick
  Reveal.tsx          scroll reveal (IntersectionObserver, fail-safe)
  Badge.tsx           pill badge variants: live | wash | warm | candy | muted
  Chip.tsx            mono tech chip
  PulseDot.tsx        pulsing accent dot (status/live)
  Nav.tsx             sticky translucent nav, "Pranav." brand
  Footer.tsx          © + real social links
lib/
  projects.ts         PROJECTS[] + PROJECTS_BY_ID  (single source of truth; has glyph, tag, callout)
  signal.ts           buildEcgPath() — ECG path generator (used by FeatureCard demo panel)
PROJECT_NOTES.md      this file
README.md             short public readme
```

**Removed during iteration (do not recreate):** `HeroWave.tsx`, `Mascot.tsx` (photo-based), `VitalsMonitor.tsx`, `LaptopTerminal.tsx`, and `buildSinePath` from signal.ts.

---

## 4. Signature interactions (how they work)

### Avatar3D
Chibi SVG of Pranav (glasses, brown hair, plaid-gradient shirt). Grouped limbs animate on their own joints via CSS keyframes in globals.css: `.char-bob` (body), `.char-leg-l/-r` (swing), `.char-arm-l` (sway), `.char-wave` (waving right arm), `.char-blink` (both eyes — wink was removed per feedback). Speech bubble "Hi, I'm Pranav 👋" sits by the waving hand (upper-left, `left-0 top-6`, tail `rounded-bl-sm`).

### ScrollProgress (replaced the old ECG "vitals monitor")
`useScroll().scrollYProgress` → `useSpring` → bar `width`; a glowing node rides the leading edge. Hidden under reduced motion. Lives in the sticky header above the nav.

### LaptopShowcase — the centerpiece
A big MacBook whose lid opens (`rotateX` on scroll-in). The screen is an "OS" with three views via `view` state: `home | cli | project`, plus a `minimized` boolean.
- **home:** bright candy "PranavOS · 4 things I've shipped", clickable project pills, "▶ Click to view projects".
- **cli:** real terminal. Commands: `ls`/`projects` (lists projects, rows clickable), `open <id>` / `cat` / `know` (opens detail), `about|stack|contact` (scrolls), `whoami`, `help`, `clear`, `home`/`exit`. Hint comments shown.
- **project:** detail window inside the laptop (badge, description, callout, chips, real link) with `← back` to cli.
- **macOS traffic lights are functional:** 🔴 red = close → home; 🟡 yellow = minimize → returns to home with a "Terminal — click to restore" **dock** at the bottom; 🟢 green decorative. Hover shows ×/– glyphs. (The old "⌂ home" text button was removed; red does it now.)
- Reduced motion: lid starts open, still interactive.

### CricketSix — scroll-driven "straight six"
Section ref + `useScroll({ target, offset:["start end","end start"] })`; a throttled rAF (`useMotionValueEvent` → `requestAnimationFrame`) sets SVG attributes directly (framer does NOT reliably bind a motion value to the SVG `transform` *attribute* — driving attrs by hand is the reliable pattern, same as ScrollProgress's node).
- **Bat swing:** single fluid sweep, `angle = lerp(135, 4, inv(p,0.2,0.6))` — low backlift → up through contact → high follow-through (a lofted six; finishing *up*, not a downward chop).
- **Ball:** launches at contact (~p 0.34), arcs up-and-right with a fading trail; flows toward the Contact section.
- **"SIX!"** gradient text scales/fades in.
- **Batsman faces right (toward the shot):** the head is mirrored about x=150 (`matrix(-1 0 0 1 300 0)`) with grille bars on the right/front. (Took a couple of iterations — verify visually when touching this.)
- Reduced motion: static end-state (bat high, ball up-field, SIX shown).

### Notebook (Field notes)
Spiral-bound notebook (binding rings, ruled lines, tape, margin line) with handwriting (Caveat) "how i build" list; "signal" highlighted with a yellow `<mark>` (`--accent-3`) — a nod to danielsun.space. Lives in its own section between About and Stack.

### PhoneMockup
Realistic phone using a true aspect ratio `aspect-[9/19.3]` (this was the fix — earlier it looked squat). Dynamic island, `9:41` status bar, side buttons, ArbFlow header (live pill), `12,480` KPI, gradient bar chart, stat tiles, home indicator. `.animate-float` bob.

### Reveal
IntersectionObserver-driven (`useInView`, once, amount 0.15). **Fail-safe:** if `IntersectionObserver` is unavailable it shows immediately, so content can never get stuck at opacity:0 (that bug — reveals stuck hidden — was the real cause of an earlier "sections not readable" report). Final state shows immediately under reduced motion.

---

## 4b. Blog (`/blog`)

Added 2026-07-02. Single source of truth is `lib/posts.ts` (`POSTS[]`).

**States (automatic, driven by `POSTS.length`):**
- **Empty → "coming soon":** `components/blog/ComingSoon.tsx` — floating blobs, pulsing badge, dark terminal card with a JS typewriter cycling draft titles (`DRAFTS[]`), shimmer "progress 67%" bar, CTAs. Typewriter + shimmer are disabled under reduced motion (static first phrase).
- **≥1 post → index:** newest post renders as a full-width featured `PostCard`, the rest in a 3-col grid. Accent gradients cycle through `POST_ACCENTS` by index.

**Nav:** the Blog link is a highlighted pill (accent wash + PulseDot), visible on *all* breakpoints (the other links stay desktop-only). While `POSTS` is empty it shows a handwritten "soon" suffix, which disappears automatically once a post exists.

**To publish a post:**
1. Add an entry to `POSTS` in `lib/posts.ts` (slug, title, excerpt, date, readingTime, tags, glyph).
2. Create `app/blog/<slug>/page.tsx`:
   ```tsx
   import PostLayout from "@/components/blog/PostLayout";
   import { postMetadata } from "@/lib/posts";

   export const metadata = postMetadata("<slug>");

   export default function Post() {
     return (
       <PostLayout slug="<slug>">
         <p>Intro…</p>
         <h2>Section</h2>
         <p>Body… <mark>highlight</mark>, <code>inline code</code>.</p>
         <blockquote>Pull quote.</blockquote>
         <pre><code>{`code block`}</code></pre>
       </PostLayout>
     );
   }
   ```
3. That's it — the index, nav pill, sorting (newest first), and per-post `<head>` metadata all follow from `lib/posts.ts`.

Body typography lives in `globals.css` as `.prose-blog` (h2/h3, links, lists with purple markers, purple-wash inline code, dark `--term-bg` code blocks, accent blockquote border, yellow `mark`). `PostLayout` renders the back link, meta row, candy title, tag pills, prose container, and an email CTA footer; unknown slugs `notFound()`.

**`AuthFlowDiagram`** (`components/blog/AuthFlowDiagram.tsx`): a dependency-free stand-in for a Mermaid sequence diagram — a vertical numbered flow between actors, with per-hop `highlight: "danger" | "success"` (red/green wash + corner pill). Built from `div`/`span` **only** so `.prose-blog` element rules never touch it (any `p`/`ul`/`li`/`code` inside a post's prose *would* pick up prose styling). Pass `caption` + `steps: FlowStep[]`. Used by the first post to render the before/after OAuth flows.

**First post (published):** `app/blog/jwts-in-redirect-urls/page.tsx` — "Why I Don't Put JWTs in Redirect URLs". Long-form, code-heavy, two `AuthFlowDiagram`s. Note the JSX conventions it uses: code blocks are module-level template-literal consts (backticks and `${` escaped as `` \` `` / `\${`); prose apostrophes/quotes are HTML entities (`&apos;`, `&ldquo;`/`&rdquo;`) to satisfy `react/no-unescaped-entities`, which `next build` treats as an error.

Files: `lib/posts.ts` · `app/blog/page.tsx` · `app/blog/<slug>/page.tsx` · `components/blog/{ComingSoon,PostCard,PostLayout,AuthFlowDiagram}.tsx`.

---

## 5. Accessibility & motion
- Skip link, semantic landmarks (`header`/`main`/`footer`/`nav`), labeled inputs/buttons, `aria-hidden` on decorative SVGs, visible focus rings.
- Every animation respects `prefers-reduced-motion`: avatar rig, scroll bar, laptop lid, reveals, cricket, float, ping — all disabled / final-state. The reduced-motion block is at the bottom of `globals.css`.

---

## 6. Verification workflow (important)

There is **no test suite**; verify visually with headless Chrome via `playwright-core` (a devDependency; reuses the system Chrome, no browser download).

- Chrome path: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.
- Pattern: start `npm run dev`, then a short node script `chromium.launch({ executablePath: CHROME })`, `page.goto`, scroll, `page.screenshot`. Run the script **from inside the project dir** so `playwright-core` resolves.
- For scroll reveals to show in a screenshot, set `reducedMotion: "reduce"` on the context (final state renders immediately) — otherwise an in-progress reveal or an IO timing quirk can look blank.
- To capture an element: `page.locator('svg[aria-label="..."]').screenshot(...)`.

### GOTCHAS
- **Do NOT run `npm run build` while `npm run dev` is running** — it clobbers `.next` and the dev server starts throwing `Cannot find module './###.js'` (blank pages). Fix: `pkill -f "next dev"`, `rm -rf .next`, restart. Always build with dev stopped.
- `next build` overwrites `.next`; `next dev` rebuilds it. Keep them separate.
- Bare `chrome --headless --screenshot` with `--virtual-time-budget` is flaky for IO-driven reveals (mobile especially). Prefer playwright + reducedMotion.

---

## 7. Feedback history (so intent is clear)
1. Initial build to the original biosignal/teal brief (hero ECG draw-in, vitals scroll monitor, 4 work cards incl. Sleep Apnea featured demo, About/Stack/Contact).
2. User pivoted: crisper hero wave, replace ECG scroll monitor (engineer not doctor → ScrollProgress bar), warmer palette + mascot, laptop-opening terminal idea.
3. Bigger redesign: **Gradient Candy** palette, articulated **Avatar3D** (replaced photo mascot), removed hero ECG (moved into Sleep Apnea panel), built the **MacBook OS** showcase (CLI + in-laptop project detail w/ back).
4. Lower sections looked bad/unreadable → fixed the Reveal stuck-hidden bug; redesigned Work cards (gradient glyphs), About (added PhoneMockup + colored facts), Stack (gradient-topped colored cards); added the **CricketSix** scroll animation; verified with screenshots.
5. Bat swing read backwards → reworked to a low→high lofted-six follow-through.
6. This round: removed avatar wink; moved speech bubble to the hand; **phone realistic proportions** (aspect ratio); more vibrant facts table & stack; gradient **Divider** between sections; added the **Notebook** (handwriting + yellow, danielsun-inspired); laptop **red=close / yellow=minimize** with restore dock; **batsman now faces the shot** (mirrored head).

---

## 8. Outstanding TODOs (marked in code)
- Résumé PDF link — `app/page.tsx` (Contact, `href="#"`) and confirm.
- Confirm the **~91%** figure in the Sleep Apnea callout — `lib/projects.ts` / `FeatureCard.tsx`.
- Optional: pull more Daniel-Sun **yellow** into the main accent mix (currently scoped to the notebook) if desired.
- Avatar likeness is hand-built SVG (`Avatar3D.tsx`) — tweak hair/skin/shirt to taste.

---

## 9. Quick "continue" checklist
1. `npm install` then `npm run dev`.
2. Make changes; keep `npm run build` green (stop dev before building).
3. Verify visually with the playwright-core screenshot pattern (§6), reducedMotion for layout, motion frames for animations.
4. Single source of project data is `lib/projects.ts`. Palette is `globals.css :root`. Section rhythm is `Section.tsx` + `Divider.tsx`.
