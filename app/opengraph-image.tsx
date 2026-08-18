import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Md. Danish — Systems & Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default social share card for the homepage and any page without its own image.
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg,#2563eb,#3b82f6,#38bdf8)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 700, opacity: 0.9 }}>
          Danish.
        </div>
        <div
          style={{
            marginTop: "auto",
            fontSize: 68,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            maxWidth: 900,
          }}
        >
          I build systems that run close to the metal.
        </div>
        <div style={{ marginTop: 28, fontSize: 30, opacity: 0.92 }}>
          Systems · Firmware & Emulators · Software Engineer
        </div>
      </div>
    ),
    { ...size },
  );
}
