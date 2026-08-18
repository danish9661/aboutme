"use client";

import { useEffect } from "react";

/**
 * Progressive enhancement: give each post heading a slug id and a hover-reveal
 * "#" deep-link, so sections are shareable. Runs after hydration and only adds
 * to the DOM — headings read fine without it.
 */
export default function HeadingAnchors() {
  useEffect(() => {
    const headings = document.querySelectorAll<HTMLElement>(
      ".prose-blog h2, .prose-blog h3",
    );
    const used = new Set<string>();

    headings.forEach((h) => {
      if (!h.id) {
        const base =
          (h.textContent || "")
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .slice(0, 60) || "section";
        let slug = base;
        let n = 2;
        while (used.has(slug)) slug = `${base}-${n++}`;
        used.add(slug);
        h.id = slug;
      }
      if (h.querySelector(".heading-anchor")) return;
      const a = document.createElement("a");
      a.href = `#${h.id}`;
      a.className = "heading-anchor";
      a.setAttribute("aria-label", "Link to this section");
      a.textContent = "#";
      h.appendChild(a);
    });
  }, []);

  return null;
}
