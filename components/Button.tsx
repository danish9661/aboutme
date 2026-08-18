import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "candy" | "outline";

interface ButtonProps {
  href: string;
  variant?: Variant;
  children: ReactNode;
  /** Force a plain <a> in a new tab (auto-enabled for http(s) links). */
  newTab?: boolean;
  className?: string;
}

const BASE =
  "inline-flex items-center gap-2 rounded-full px-5 py-3 font-mono text-[13px] transition-all hover:-translate-y-0.5 motion-reduce:hover:translate-y-0";

const VARIANTS: Record<Variant, string> = {
  candy: "bg-candy text-white shadow-md shadow-accent/20",
  outline:
    "border border-line-strong bg-surface text-ink hover:border-accent hover:text-accent",
};

/**
 * The one pill CTA used across the site. Renders an internal `next/link` for
 * "/"- and "#"-hrefs, or a plain `<a>` for http(s)/mailto (http(s) opens in a
 * new tab). Two looks: `candy` (gradient) and `outline`.
 */
export default function Button({
  href,
  variant = "candy",
  children,
  newTab,
  className = "",
}: ButtonProps) {
  const cls = `${BASE} ${VARIANTS[variant]} ${className}`;
  const isHttp = /^https?:/.test(href);
  const isExternal = isHttp || href.startsWith("mailto:");

  // Plain <a> for external links, or any link explicitly opened in a new tab
  // (e.g. a static PDF served from /public).
  if (isExternal || newTab) {
    const openNewTab = newTab ?? isHttp;
    const bp = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const resolvedHref =
      !isExternal && href.startsWith("/") && bp && !href.startsWith(bp)
        ? `${bp}${href}`
        : href;
    return (
      <a
        href={resolvedHref}
        className={cls}
        {...(openNewTab ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
