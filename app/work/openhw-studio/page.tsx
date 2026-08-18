import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { Eyebrow } from "@/components/Section";
import Badge from "@/components/Badge";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "OpenHW Studio — In-Browser Hardware Simulator & Compilation Engine",
  description:
    "Case study: Core contribution across 550+ commits and 480k+ LoC for FOSSEE, IIT Bombay. Multi-threaded Web Workers, WASM ESP32 networking, dual-layer compilation caching, and auto-wiring BFS routing.",
};

const STACK_PILLS = [
  { label: "TypeScript", color: "#ff4e9b", wash: "rgba(255,78,155,0.12)" },
  { label: "WebAssembly", color: "#845ec2", wash: "rgba(132,94,194,0.13)" },
  { label: "Rust", color: "#e2563b", wash: "rgba(255,107,107,0.14)" },
  { label: "Web Workers", color: "#d98324", wash: "rgba(255,179,71,0.18)" },
  { label: "Node.js / Express", color: "#5a5a5f", wash: "rgba(90,90,95,0.08)" },
  { label: "Docker", color: "#2496ed", wash: "rgba(36,150,237,0.12)" },
];

const AT_A_GLANCE = [
  { key: "ROLE", value: "Core Contributor · 550+ Commits · 236 Merged PRs · 480k+ LoC" },
  { key: "ORGANIZATION", value: "FOSSEE, IIT Bombay" },
  { key: "PRODUCTION", value: "https://openhw-studio.fossee.in/" },
  { key: "STACK", value: "React · TypeScript · Rust · WASM · Web Workers · Node.js · Docker" },
  { key: "STATUS", value: "Live in active educational production" },
];

const ARCHITECTURE = [
  {
    key: "SIMULATION PIPELINE",
    value: "Multi-threaded Web Worker architecture (execute.ts, avr-runner.ts, rp2040-runner.ts) isolating CPU execution ticks and memory state interception without blocking the React UI.",
  },
  {
    key: "WASM ESP32 NETWORKING",
    value: "WebAssembly cycle-budgeted runner (rv32-runner.ts) with virtual socket routing gateways for BLE, Wi-Fi, and Thread, plus zero-drop Ethernet packet padding for LwIP.",
  },
  {
    key: "DUAL COMPILATION CACHING",
    value: "Aggressive dual-layer caching strategy (Client IndexedDB + Server SHA-1 RAM/Disk pools) reducing cloud build latencies from 8s to under 200ms.",
  },
  {
    key: "INTELLIGENT AUTOWIRING",
    value: "Rust WASM Manhattan Router enforcing 7px lane spacing, short-circuit detection physics, and Breadth-First Search (BFS) routing for breadboards.",
  },
];

const DELIVERABLES = [
  {
    title: "9 Virtual Peripherals & SVG Silicon Modeling",
    desc: "Engineered simulation logic, SVG hardware interfaces, and validation hooks for ILI9341 TFT displays, ESP32-CAM, SSD1306 OLED, Character Displays, IR Remote/Receivers, and Class-D audio amplifiers using SharedArrayBuffers at 30+ FPS.",
  },
  {
    title: "Dual-Layer Compilation Caching (<200ms)",
    desc: "Implemented SHA-1 hashing, 500MB memory caching, and a 1GB compiled binary disk cache with a serialized queue manager to completely prevent OOM server crashes under heavy classroom concurrency.",
  },
  {
    title: "Rust WASM Autograding & Auto-Fix GUI",
    desc: "Created client-side boolean matrix evaluation algorithms compiled from Rust into WebAssembly to automatically assess student circuits and mathematically render guided SVG repair splines.",
  },
  {
    title: "Delta Telemetry Optimization (99% Payload Drop)",
    desc: "Engineered state fingerprinting in execute.ts with ultra-lightweight delta early returns, cutting postMessage payload size from multiple kilobytes to a 50-byte keep-alive and eliminating UI memory thrashing.",
  },
];

export default function OpenHWStudioCaseStudy() {
  return (
    <article className="relative mx-auto w-full max-w-page px-6 py-16 sm:px-8 sm:py-24">
      {/* ── Header ── */}
      <Link
        href="/#work"
        className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-3 transition-colors hover:text-accent"
      >
        ← Back to selected work
      </Link>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Badge
          label="FOSSEE · IIT Bombay · 550+ Commits"
          variant="live"
          pulse
        />
        <span className="font-mono text-[12px] text-ink-3">
          Summer 2026 Core Contribution
        </span>
      </div>

      <h1 className="mt-5 text-[40px] font-semibold leading-[1.05] tracking-tightest sm:text-[54px] lg:text-[60px]">
        OpenHW Studio
      </h1>

      <p className="mt-4 max-w-2xl text-[19px] leading-relaxed text-ink-2 sm:text-[21px]">
        Full-stack in-browser hardware simulation platform, multi-architecture
        emulation runners, WebAssembly networking, and high-throughput compiler
        infrastructure built for classroom-scale virtual engineering labs.
      </p>

      {/* ── Stack pills ── */}
      <div className="mt-6 flex flex-wrap gap-2">
        {STACK_PILLS.map((p) => (
          <span
            key={p.label}
            className="rounded-lg px-2.5 py-1 font-mono text-[11px] font-medium"
            style={{ background: p.wash, color: p.color }}
          >
            {p.label}
          </span>
        ))}
      </div>

      {/* ── Quick links ── */}
      <div className="mt-8 flex flex-wrap gap-4">
        <Button href="https://openhw-studio.fossee.in/" newTab>
          Live Platform: openhw-studio.fossee.in →
        </Button>
        <Button href="https://github.com/OpenHW-Studio" variant="outline" newTab>
          GitHub Organization
        </Button>
      </div>

      {/* ── At a glance table ── */}
      <div className="mt-14 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="bg-candy h-1.5 w-full" aria-hidden />
        <dl className="divide-y divide-line">
          {AT_A_GLANCE.map((row) => (
            <div
              key={row.key}
              className="grid grid-cols-1 gap-2 p-5 sm:grid-cols-[200px_1fr] sm:gap-6"
            >
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
                {row.key}
              </dt>
              <dd className="text-[14px] font-medium text-ink break-words">
                {row.value.startsWith("http") ? (
                  <a
                    href={row.value}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-accent underline hover:opacity-80"
                  >
                    {row.value}
                  </a>
                ) : (
                  row.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ── Core Contributions & Deliverables ── */}
      <section className="mt-20">
        <Eyebrow>Key Engineering Deliverables</Eyebrow>
        <h2 className="mt-4 text-[28px] font-semibold tracking-tightest sm:text-[36px]">
          What I architected &amp; built across 480,000+ lines of code
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {DELIVERABLES.map((d) => (
            <div
              key={d.title}
              className="rounded-2xl border border-line bg-surface/70 p-7 backdrop-blur"
            >
              <h3 className="text-[18px] font-semibold tracking-tight text-ink">
                {d.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
                {d.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Architectural Breakdown ── */}
      <section className="mt-20">
        <Eyebrow>System Architecture</Eyebrow>
        <h2 className="mt-4 text-[28px] font-semibold tracking-tightest sm:text-[36px]">
          Multi-layer execution &amp; compilation pipeline
        </h2>

        <div className="mt-8 space-y-4">
          {ARCHITECTURE.map((a, i) => (
            <div
              key={a.key}
              className="rounded-xl border border-line bg-surface/50 p-5 sm:p-6"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/15 font-mono text-[11px] font-bold text-accent">
                  {i + 1}
                </span>
                <h3 className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink">
                  {a.key}
                </h3>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-2 pl-9">
                {a.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Impact & Verification ── */}
      <section className="mt-20 rounded-2xl border border-line bg-surface p-8 sm:p-12">
        <Eyebrow>Real-World Production Impact</Eyebrow>
        <h2 className="mt-4 text-[26px] font-semibold tracking-tightest sm:text-[32px]">
          Deployed live at IIT Bombay for virtual hardware laboratories
        </h2>
        <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-ink-2">
          OpenHW Studio is currently active in production, providing thousands of
          students with in-browser microcontroller simulation (AVR Arduino, Raspberry Pi Pico RP2040,
          and ESP32), auto-wiring assistance, and automated grading without requiring physical hardware
          kits or native toolchain installations.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button href="https://openhw-studio.fossee.in/" newTab>
            Explore OpenHW Studio Live →
          </Button>
          <Button href="mailto:9661346164h@gmail.com" variant="outline">
            Discuss Low-Level Architecture
          </Button>
        </div>
      </section>
    </article>
  );
}
