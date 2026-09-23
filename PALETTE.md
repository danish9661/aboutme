# PALETTE — Ultraviolet Neon (LOCKED: Variant A + brighter Variant-C terminal)

> **Source of truth for this repo:** `app/globals.css`. If you change tokens here, update them there and re-sync. Nothing enforces it automatically.

---

## Colour Roles — every hue has one job

| Role              | Light       | Dark        | Job |
|---|---|---|---|
| Ultraviolet (accent)  | `#7C3AED` | `#C084FC` | identity + calls to action |
| Ultraviolet hover     | `#6D28D9` | `#E9D5FF` | CTA hover / bright text |
| Neon lilac (accent-2) | `#C084FC` | `#E9D5FF` | live systems, telemetry, data |
| Signal (accent-3)     | `#B45309` | `#FBBF24` | warnings + notebook marks only |
| Page background       | `#FFFFFF` | `#150A2E` | dark is a neon-tinted night |
| Card surface          | `#F8F7FF` | `#1E0F42` | |
| Raised surface        | `#FFFFFF` | `#281359` | |
| Border                | `#E6E1F7` | `#3A2568` | |
| Border (strong)       | `#C9BFF0` | `#523894` | |
| Text                  | `#1A1033` | `#F1EAFE` | |
| Text muted            | `#4C3F73` | `#BCAEE3` | |
| Text faint            | `#6F6394` | `#8A7BB8` | |
| Success               | `#059669` | `#34D399` | |
| Warning               | `#B45309` | `#FBBF24` | |
| Error                 | `#DC2626` | `#F87171` | |
| Terminal shell        | `#1E0E44` | `#1E0E44` | brighter neon shell, both themes |
| Terminal line         | `#6D28D9` | `#7C3AED` | vivid violet border |

**Signature ramp:** ultraviolet `#7C3AED` → neon lilac `#C084FC`
(both themes). No cyan, no magenta.
Reserved for the primary CTA and the laptop home screen only.
Headings, badges, glyph tiles, and bars stay solid — never gradient text.

### 4. Terminal themes are Ultraviolet Neon only — no green, no nord, no pink

`components/LaptopShowcase.tsx` exposes exactly four terminal themes:

| Theme     | bg          | Use |
|---|---|---|
| `default` | neon shell `#1E0E44` | default CLI |
| `royal`   | `#221052`   | saturated violet |
| `palace`  | `#150A2E`   | deep night, dim text |
| `neon`    | `#221052`   | brightest violet pop |

Old names still work as aliases (`cyberpunk`→`royal`, `matrix`→`neon`,
`nord`→`palace`) so bookmarks and muscle memory don't break.
`matrix` the *command* now renders **Violet Signal Rain** (`#C084FC` /
`#E9D5FF` on neon shell) — never green phosphor. `snake`, `emu`,
`stats`, `neofetch`, `danish`, `whoami` panels all use the same
`#221052` panel + `#C084FC`/`#E9D5FF` accents. Window chrome stays macOS
traffic lights; nothing else in the terminal may introduce a new hue.

---

## Banned hues — do NOT reintroduce

No cyan (`#0891B2`, `#22D3EE`, `#38bdf8`, `rgba(56,189,248,…)`), no blue
(`#2563eb`, `#3b82f6`, `#1d4ed8`), no green phosphor (`#28c840`, `#a2f0b0`),
no pink (`#ff4e9b`, `#D946EF`), no nord greys, no amber outside `accent-3`.
macOS traffic lights (`#ff5f57`, `#febc2e`) and the cricket-ball reds are the
only exceptions. Verified with:

```bash
npm run build
grep -rn "2563eb\|38bdf8\|3b82f6\|1d4ed8\|0284c7\|60a5fa\|56,189,248\|8,145,178\|0891B2\|22D3EE\|D946EF\|28c840\|a2f0b0\|ff4e9b\|00f0ff\|6D28D9\|8B5CF6\|109,40,217\|5B21B6\|A78BFA\|14092B\|1D1140\|251755\|352464\|4A3486" \
  app components lib config public/doom/index.html \
  --include="*.tsx" --include="*.ts" --include="*.css" --include="*.html" \
  | grep -v PROJECT_NOTES | grep -v "globals.css" | grep -v "PALETTE"
# expect: no matches (globals.css + this spec are the only homes for those hexes)
```

## Three Rules Any Agent Must Know

### 1. Light and dark are different hues — never derive one from the other

`#7C3AED` on `#150A2E` measures **~2.9:1** — it fails text contrast. That is why:
- **Light mode** uses `#7C3AED` as the ultraviolet primary (~4.2:1 on white;
  body text still uses `--ink`, never violet-on-white at small sizes)
- **Dark mode** uses `#C084FC` for text accents (7.1:1 on neon night) while
  keeping `#7C3AED` for fills and ramps

Do not programmatically derive one theme from the other (e.g. "darken by 20%").

### 2. Two typefaces with strict roles

| Typeface       | Role                                                                 |
|---|---|
| **Inter**      | All prose, body copy, UI labels, headings                           |
| **JetBrains Mono** | Anything that is *notation* — symbols, code, numbers being compared, monospaced labels |

Load Inter with `subsets: ["latin", "latin-ext"]` or Greek characters (ε, Σ) fall back and look broken.  
Never use Inter for code. Never use JetBrains Mono for flowing prose.

### 3. Two motion vocabularies that never mix

**Vocabulary A — computational (no overshoot)**  
`cubic-bezier(0.2, 0.8, 0.2, 1)`  
Use for anything explaining a computation: panels opening, step progressions, data transitions.

**Vocabulary B — marketing (slight overshoot)**  
`cubic-bezier(0.22, 1.2, 0.36, 1)`  
Use only for marketing surfaces: hero CTAs, badge pop-ins.

| Name    | Duration | Use |
|---|---|---|
| hover   | 120ms   | Interactive state change |
| panel   | 180ms   | Panel open/close |
| step    | 280ms   | The important one — eye follows one thing becoming another |
| merge   | 420ms   | Combining elements |
| reveal  | 620ms   | Section entrance |

---

## Effect Classes

```css
/* Glassmorphism panel */
.k-glass {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(16px) saturate(1.6);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

/* Signature ramp background — primary CTA + laptop home only */
.k-aurora {
  background-image: var(--candy);
}

/* Accent text — solid violet, never gradient (with forced-colors fallback) */
.k-gradient-text {
  background-image: none;
  color: var(--accent);
}
@media (forced-colors: active) {
  .k-gradient-text {
    background-image: none;
    color: CanvasText;
    forced-color-adjust: auto;
  }
}
```

---

## CSS Variable Block (both themes)

```css
/* Light */
:root {
  --bg: #FFFFFF;
  --surface: #F8F7FF;
  --raised: #FFFFFF;
  --line: #E6E1F7;
  --line-strong: #C9BFF0;
  --ink: #1A1033;
  --ink-2: #4C3F73;
  --ink-3: #6F6394;
  --accent: #7C3AED;
  --accent-bright: #6D28D9;
  --accent-wash: rgba(124, 58, 237, 0.12);
  --accent-2: #C084FC;
  --accent-2-bright: #A855F7;
  --accent-2-wash: rgba(192, 132, 252, 0.14);
  --accent-3: #B45309;
  --accent-3-wash: rgba(180, 83, 9, 0.12);
  --candy: linear-gradient(135deg, #7C3AED, #C084FC);
  --success: #059669;
  --warning: #B45309;
  --error: #DC2626;
  --term-bg: #1E0E44;
  --term-line: #6D28D9;
}
/* NOTE: --term-bg/--term-line are the brighter neon shell in BOTH themes —
   the terminal is always dark glass, even in light mode (Variant C lock-in). */

/* Dark */
:root[data-theme="dark"] {
  --bg: #150A2E;
  --surface: #1E0F42;
  --raised: #281359;
  --line: #3A2568;
  --line-strong: #523894;
  --ink: #F1EAFE;
  --ink-2: #BCAEE3;
  --ink-3: #8A7BB8;
  --accent: #C084FC;
  --accent-bright: #E9D5FF;
  --accent-wash: rgba(192, 132, 252, 0.16);
  --accent-2: #E9D5FF;
  --accent-2-bright: #E9D5FF;
  --accent-2-wash: rgba(233, 213, 255, 0.12);
  --accent-3: #FBBF24;
  --accent-3-wash: rgba(251, 191, 36, 0.12);
  --candy: linear-gradient(135deg, #7C3AED, #C084FC);
  --success: #34D399;
  --warning: #FBBF24;
  --error: #F87171;
  --term-bg: #1E0E44;
  --term-line: #7C3AED;
}
```
