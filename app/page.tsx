import Hero from "@/components/Hero";
import LaptopShowcase from "@/components/LaptopShowcase";
import CricketSix from "@/components/CricketSix";
import PhoneMockup from "@/components/PhoneMockup";
import Notebook from "@/components/Notebook";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import ProjectCard from "@/components/ProjectCard";
import PulseDot from "@/components/PulseDot";
import Button from "@/components/Button";
import { PORTFOLIO_CONFIG } from "@/config/portfolio";
import { PROJECTS_BY_ID } from "@/lib/projects";
import { SITE_URL } from "@/lib/posts";

const PROFILES = [
  "https://github.com/danish9661",
  "https://www.linkedin.com/in/md-danish966",
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "Md. Danish",
      url: SITE_URL,
      image: `${SITE_URL}/icon.png`,
      jobTitle: "Systems & Software Engineer",
      sameAs: PROFILES,
    },
    {
      "@type": "WebSite",
      name: "Md. Danish",
      url: SITE_URL,
      image: `${SITE_URL}/icon.png`,
    },
  ],
};

const STACK = [
  {
    title: "Languages",
    color: "#7C3AED",
    wash: "rgba(124,58,237,0.12)",
    items: ["C", "C++", "Rust", "TypeScript", "JavaScript", "Python", "Assembly"],
  },
  {
    title: "Emulators & Systems",
    color: "#A855F7",
    wash: "rgba(192,132,252,0.14)",
    items: ["WebAssembly (WASM)", "Unicorn Engine", "RISC-V (RV32)", "ARM Cortex-M", "QEMU", "Renode"],
  },
  {
    title: "Embedded & Hardware",
    color: "#A855F7",
    wash: "rgba(192,132,252,0.14)",
    items: ["STM32 (F1/F4)", "ESP32-S3", "RP2040", "USB HID / FIDO2", "BLE / Wi-Fi", "I2C / SPI / UART"],
  },
  {
    title: "Web & DevOps",
    color: "#7C3AED",
    wash: "rgba(124,58,237,0.12)",
    items: ["React / Next.js", "Node.js", "Web Workers", "Docker", "CI/CD", "Tailwind"],
  },
];

const FACTS = [
  { key: "focus", value: "Systems · WASM Emulation", color: "#7C3AED" },
  { key: "open source", value: "Core Contributor @ OpenHW Studio", color: "#7C3AED" },
  { key: "delivered", value: "550+ Commits · 480k+ LoC", color: "#A855F7" },
  { key: "specialty", value: "Emulators, Firmware, Microcontrollers", color: "#A855F7" },
  { key: "looking for", value: "Systems & SWE roles / Internships", color: "#7C3AED" },
  { key: "based", value: "India · remote-friendly", color: "#A855F7" },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <Hero />

      {/* ── Interactive laptop showcase ── */}
      <LaptopShowcase />

      {/* ── Selected work ── */}
      <Section id="work" eyebrow="work">
        {/* Org flagship — OpenHW Studio (FOSSEE, IIT Bombay) */}
        <div className="mb-5 flex items-center gap-2.5">
          <PulseDot />
          <h3 className="font-mono text-[11px] text-ink-2">
            org flagship — OpenHW Studio · FOSSEE, IIT Bombay
          </h3>
        </div>
        <Reveal>
          <ProjectCard project={PROJECTS_BY_ID["openhw-studio"]} />
        </Reveal>

        {/* Emulator fleet — 10 standalone repos */}
        <div className="mb-5 mt-14 flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-ink-3" aria-hidden />
          <h3 className="font-mono text-[11px] text-ink-3">
            emulator fleet — 10 standalone builds
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "stm32f4-emulator",
            "stm32f1-emulator",
            "picoemu",
            "esp32-emulator",
            "esp32s3-emulator",
            "esp-rv32",
            "8086emu",
            "microbit-emulator",
            "uno-r4-emulator",
            "wasm-game",
          ].map((id, i) => (
            <Reveal key={id} delay={(i % 3) * 0.05}>
              <ProjectCard project={PROJECTS_BY_ID[id]} />
            </Reveal>
          ))}
        </div>

        {/* Hardware security — separate row, not an emulator */}
        <div className="mb-5 mt-14 flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-ink-3" aria-hidden />
          <h3 className="font-mono text-[11px] text-ink-3">
            hardware security — ESP32-S3 key + KVM
          </h3>
        </div>
        <Reveal>
          <ProjectCard project={PROJECTS_BY_ID["es32s3-hid"]} />
        </Reveal>
      </Section>

      {/* ── About ── */}
      <Section id="about" eyebrow="about">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <div>
            <Reveal>
              <div className="space-y-5 text-[18px] leading-relaxed text-ink-2">
                <p>
                  I build high-performance systems and developer tooling. Most of what I&apos;m proud of
                  sits at the boundary where{" "}
                  <span className="font-medium text-ink">hardware architecture meets WebAssembly and cloud compilers</span>.
                </p>
                <p>
                  As a core contributor at <span className="font-medium text-ink">OpenHW Studio</span>,
                  I authored over 550+ commits and 480k+ lines of code—engineering real-time Web Worker execution
                  pipelines, WASM networking stacks (Wi-Fi/BLE), dual-layer compilation caching (&lt;200ms latency),
                  and automated netlist routing algorithms.
                </p>
                <p>
                  Whether emulating ARM Cortex-M microcontrollers in the browser or engineering hardware security keys with
                  FIDO2 and TOTP on the ESP32-S3, I turn complex low-level specifications into reliable, lightning-fast software.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <dl className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface">
                <div className="h-1.5 w-full bg-accent" aria-hidden />
                {FACTS.map((fact, i) => (
                  <div
                    key={fact.key}
                    className={`flex items-center justify-between gap-6 px-5 py-3.5 ${
                      i % 2 === 1 ? "bg-bg" : ""
                    }`}
                  >
                    <dt className="flex items-center gap-2.5 font-mono text-[11px] font-medium">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: fact.color }}
                        aria-hidden
                      />
                      <span style={{ color: fact.color }}>{fact.key}</span>
                    </dt>
                    <dd className="text-right text-[14px] font-semibold text-ink">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <PhoneMockup />
          </Reveal>
        </div>
      </Section>

      {/* ── Field notes (notebook) ── */}
      <Section eyebrow="field notes">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div>
              <h2 className="text-[28px] font-semibold tracking-tightest text-ink sm:text-[34px]">
                How I think about building.
              </h2>
              <p className="mt-4 max-w-md text-[17px] leading-relaxed text-ink-2">
                No grand process — just a loop I trust: figure out what actually
                matters, ship the smallest real thing, put it in front of people,
                and tighten it from there.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <Notebook />
          </Reveal>
        </div>
      </Section>

      {/* ── Stack ── */}
      <Section id="stack" eyebrow="stack">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STACK.map((col, i) => (
            <Reveal key={col.title} delay={i * 0.05}>
              <div className="group h-full overflow-hidden rounded-2xl border border-line bg-surface transition-colors duration-200 hover:border-accent/50">
                <div className="h-1.5 w-full" style={{ background: col.color }} aria-hidden />
                <div className="p-6">
                  <h3
                    className="mb-4 font-mono text-[12px] font-semibold"
                    style={{ color: col.color }}
                  >
                    {col.title}
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {col.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-md px-3 py-1.5 text-[13px] font-medium text-ink"
                        style={{ background: col.wash }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Cricket six (scroll animation) ── */}
      <CricketSix />

      {/* ── Contact ── */}
      <Section id="contact" eyebrow="contact">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-[34px] font-semibold tracking-tightest sm:text-[46px]">
                Let&apos;s build something.
              </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-ink-2">
              I&apos;m looking for Systems &amp; Software Engineering roles. If you
              are building low-level systems, developer tooling, or hardware simulators, let&apos;s talk.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button href="mailto:9661346164h@gmail.com">Email me</Button>
              <Button
                href={PORTFOLIO_CONFIG.resumePdfPath}
                variant="outline"
                newTab
              >
                Résumé (PDF)
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
