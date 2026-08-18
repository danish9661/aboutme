import { Eyebrow } from "@/components/Section";
import Button from "@/components/Button";

export default function NotFound() {
  return (
    <div className="relative mx-auto flex min-h-[70vh] w-full max-w-page flex-col items-center justify-center px-6 py-24 text-center sm:px-8">
      {/* gradient blob backdrop, same language as the case study / coming-soon */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] overflow-hidden"
      >
        <div className="absolute -left-24 -top-16 h-80 w-80 rounded-full bg-accent-wash blur-3xl" />
        <div className="absolute right-0 -top-8 h-72 w-72 rounded-full bg-accent-2-wash blur-3xl" />
        <div className="absolute left-1/3 top-40 h-64 w-64 rounded-full bg-accent-3-wash blur-3xl" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(56,189,248,0.12) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "linear-gradient(to bottom, black, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />
      </div>

      <Eyebrow>Error 404</Eyebrow>

      <h1 className="mt-6 text-[64px] font-semibold leading-none tracking-tightest sm:text-[88px]">
        <span className="text-candy">404</span>
      </h1>

      <p className="mt-6 max-w-md text-[17px] leading-relaxed text-ink-2">
        This page slipped out of the training distribution. The link may be
        broken, or the page may have moved.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Button href="/">Back home →</Button>
        <Button href="/#work" variant="outline">
          See my work
        </Button>
        <Button href="/blog" variant="outline">
          Read the blog
        </Button>
      </div>
    </div>
  );
}
