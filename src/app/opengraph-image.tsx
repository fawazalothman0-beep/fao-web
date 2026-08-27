import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = site.name.en;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0a1324 0%, #132238 100%)",
          padding: "72px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 6,
              height: 64,
              padding: "10px 14px",
              border: "2px solid rgba(255,255,255,0.25)",
              borderRadius: 12,
            }}
          >
            <div style={{ width: 12, height: 30, background: "#9aa6ba" }} />
            <div style={{ width: 14, height: 44, background: "#ffffff" }} />
            <div style={{ width: 11, height: 24, background: "#9aa6ba" }} />
          </div>
          <div style={{ fontSize: 26, letterSpacing: 4, color: "#c9a75f", textTransform: "uppercase" }}>
            Kuwait Real Estate
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05 }}>Fawaz Al Othman Real Estate</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 56, height: 3, background: "#b08a46" }} />
            <div style={{ fontSize: 34, color: "rgba(255,255,255,0.75)" }}>
              Owners · Buyers · Deals, managed with discipline
            </div>
          </div>
        </div>

        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.6)" }}>{site.domain}</div>
      </div>
    ),
    size,
  );
}
