import Link from "next/link";
import PulseDot from "./PulseDot";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "./ThemeToggle";
import { POSTS } from "@/lib/posts";

const LINKS = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#stack", label: "Stack" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  const blogIsLive = POSTS.length > 0;

  return (
    <nav
      aria-label="Primary"
      className="border-b border-line bg-bg/72 backdrop-blur-xl backdrop-saturate-150"
    >
      <div className="mx-auto flex h-14 w-full max-w-page items-center justify-between px-6 sm:px-8">
        <Link
          href="/"
          className="font-sans text-[17px] font-semibold tracking-tightest text-ink"
        >
          Danish<span className="text-accent">.</span>
        </Link>

        <div className="flex items-center gap-2.5 sm:gap-8">
          <ul className="hidden items-center gap-8 sm:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink-2 transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Blog — highlighted, visible on every breakpoint */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-accent-wash px-3.5 py-1.5 font-mono text-[12px] uppercase tracking-[0.1em] text-accent shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-accent/20 motion-reduce:hover:translate-y-0"
          >
            <PulseDot />
            Blog
            {!blogIsLive && (
              <span className="font-hand text-[13px] normal-case tracking-normal text-accent-2">
                soon
              </span>
            )}
          </Link>

          <ThemeToggle />

          {/* Primary links as a hamburger on phones */}
          <MobileMenu links={LINKS} />
        </div>
      </div>
    </nav>
  );
}
