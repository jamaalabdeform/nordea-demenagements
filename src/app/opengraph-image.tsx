import { ImageResponse } from "next/og";
import { company } from "@/config/company";

export const alt = `${company.name} — déménageur à Lille`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#11241e", color: "#fbf9f4", padding: 80, fontFamily: "serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 30, letterSpacing: 8, fontFamily: "sans-serif" }}>
          <div style={{ width: 16, height: 16, borderRadius: 99, background: "#cf7a55" }} />
          {company.wordmark} · {company.descriptor.toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 86, lineHeight: 1.02, maxWidth: 900 }}>Un déménagement sans mauvaises surprises.</div>
          <div style={{ fontSize: 30, marginTop: 30, opacity: 0.65, fontFamily: "sans-serif" }}>Estimez votre volume en quelques minutes · Lille et toute la France</div>
        </div>
      </div>
    ),
    size,
  );
}
