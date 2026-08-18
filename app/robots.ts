import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/posts";

export const dynamic = "force-static";

/** Generated at build → served at /robots.txt. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
