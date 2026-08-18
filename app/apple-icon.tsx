import { ImageResponse } from "next/og";

export const dynamic = "force-static";

// Apple touch icon (home-screen bookmark) — generated at build.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg,#2563eb,#3b82f6,#38bdf8)",
          color: "#fff",
          fontSize: 116,
          fontWeight: 700,
        }}
      >
        D
      </div>
    ),
    { ...size },
  );
}
