import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Caveat } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import ScrollProgress from "@/components/ScrollProgress";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/posts";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500"],
});

const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hand",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Md. Danish — Systems & Software Engineer",
  description:
    "Systems, embedded firmware, emulators, and low-level software engineer. Building fast, reliable tools and hardware systems.",
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "Md. Danish — Blog" }],
    },
  },
  openGraph: {
    title: "Md. Danish — Systems & Software Engineer",
    description:
      "Systems, embedded firmware, emulators, and low-level software engineer. Building fast, reliable tools and hardware systems.",
    type: "website",
  },
  verification: {
    google: "15oUGn7tDY5qFKh0oX7q0zWcuUJ_nFIIjjZk6ixculo",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff6f6" },
    { media: "(prefers-color-scheme: dark)", color: "#141019" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Applies a stored theme before first paint so there's no light→dark flash.
const NO_FLASH = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jetbrainsMono.variable} ${caveat.variable}`}
    >
      <head>
        <meta
          name="google-site-verification"
          content="15oUGn7tDY5qFKh0oX7q0zWcuUJ_nFIIjjZk6ixculo"
        />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH }} />
        <ViewTransitions>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:border focus:border-line focus:bg-surface focus:px-4 focus:py-2 focus:font-mono focus:text-[13px] focus:text-ink"
          >
            Skip to content
          </a>

          <header className="sticky top-0 z-50">
            <ScrollProgress />
            <Nav />
          </header>

          <main id="main">{children}</main>

          <Footer />
        </ViewTransitions>
      </body>
    </html>
  );
}
