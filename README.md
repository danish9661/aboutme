# Pranav Shukla — Portfolio !!

This is my personal developer portfolio. I'm a CS undergrad and builder, and I ship across applied ML (healthcare biosignals) and full-stack SaaS. I built this site to show — not just tell — that I can take an ambiguous problem and turn it into something that runs.

**Live:** https://psportfolio-lyart.vercel.app/

## What it is

A single-page site with a few interactive bits I had fun building:

- **An articulated avatar of me** — hand-built SVG that bobs, swings its legs, and waves.
- **An interactive MacBook** — click in to a real terminal, run `ls` / `open arbflow`, and "know more" opens each project in a window inside the laptop. The red/yellow window buttons close and minimise like macOS.
- **A scroll-driven cricket six** — because I play, and I like a clean straight six the same way I like shipping.
- **A spiral notebook** with my "field notes" on how I build.
- **A realistic phone mockup** showing ArbFlow, the analytics SaaS I'm building.

Everything respects `prefers-reduced-motion`, and the whole thing is keyboard-accessible.

## Selected work

- **ArbFlow** — multi-tenant GA4 analytics SaaS, live in production. ([demo](https://marketing-saas-platform-pi.vercel.app/))
- **Self-Healing MLOps Pipeline** — training pipeline that detects failures and recovers itself.
- **Sleep Apnea Detection** — 1D CNN on single-lead biosignals, validated leave-one-patient-out (paper in progress).
- **Pre-Eclampsia Risk Model** — flags high-risk pregnancies early from routine clinical data.

## Built with

Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion. Deployed on Vercel.

## Running it locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Project layout

- `app/` — App Router pages (`/` and `/work/arbflow`), root layout, and the design tokens.
- `components/` — the building blocks: `Avatar3D`, `LaptopShowcase`, `CricketSix`, `Notebook`, `PhoneMockup`, `ProjectCard`, `FeatureCard`, and friends.
- `lib/projects.ts` — single source of truth for my project data.
- `tailwind.config.ts` + `app/globals.css` — the palette and tokens. Everything is driven off CSS variables in the `:root` block, so the whole theme can be swapped from one place.

## Reach me

- Email — pranavmshukla@gmail.com
- GitHub — [@PranavShukla2](https://github.com/PranavShukla2)
- LinkedIn — [pranav-shukla-softwaredeveloper](https://www.linkedin.com/in/pranav-shukla-softwaredeveloper/)

I'm open to SWE internships with early-stage teams for 2026. I can think and help you ship, say hi.
