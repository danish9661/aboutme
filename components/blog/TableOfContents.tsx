"use client";

import { useEffect, useState } from "react";

interface Item {
  id: string;
  text: string;
}

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 60) || "section"
  );
}

/**
 * Right-rail contents for long posts (large screens only). Reads the post's
 * h2s, mirrors the id scheme in HeadingAnchors, and marks the section in view
 * via IntersectionObserver. Hidden when there are fewer than two headings.
 */
export default function TableOfContents() {
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>(".prose-blog h2"),
    );
    const used = new Set<string>();

    const list = headings.map((h) => {
      const text = (h.textContent || "").replace(/#\s*$/, "").trim();
      if (!h.id) {
        let slug = slugify(text);
        const base = slug;
        let n = 2;
        while (used.has(slug)) slug = `${base}-${n++}`;
        used.add(slug);
        h.id = slug;
      } else {
        used.add(h.id);
      }
      return { id: h.id, text };
    });
    setItems(list);

    // Active = the last heading whose top has scrolled above the offset, so a
    // section stays highlighted even when scrolled between two headings.
    let raf = 0;
    const update = () => {
      raf = 0;
      const offset = 100;
      let current = headings[0]?.id ?? "";
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= offset) current = h.id;
        else break;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  if (items.length < 2) return null;

  return (
    <nav aria-label="On this page" className="hidden lg:block">
      <div className="sticky top-24">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
          On this page
        </p>
        <ul className="space-y-1 border-l border-line">
          {items.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                className={`-ml-px block border-l-2 py-1 pl-3 text-[13px] leading-snug transition-colors ${
                  active === it.id
                    ? "border-accent text-accent"
                    : "border-transparent text-ink-3 hover:text-ink-2"
                }`}
              >
                {it.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
