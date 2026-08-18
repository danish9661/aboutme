const FOOTER_LINKS = [
  { href: "https://github.com/danish9661", label: "GitHub" },
  {
    href: "https://www.linkedin.com/in/md-danish966",
    label: "LinkedIn",
  },
  { href: "https://www.npmjs.com/~danish9661", label: "npm" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-page flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row sm:px-8">
        <p className="font-mono text-[12px] text-ink-3">© 2026 Md. Danish</p>
        <ul className="flex items-center gap-6">
          {FOOTER_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                className="font-mono text-[12px] text-ink-2 transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
