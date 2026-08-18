import { OG_SIZE, OG_CONTENT_TYPE, postOgImage } from "@/lib/og";
import { POSTS_BY_SLUG } from "@/lib/posts";

export const dynamic = "force-static";

const SLUG = "jwts-in-redirect-urls";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = POSTS_BY_SLUG[SLUG]?.title ?? "Blog — Pranav Shukla";

export default function Image() {
  return postOgImage(SLUG);
}
