import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME} — plain-English investing education`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const font = await readFile(
    join(process.cwd(), "assets", "fonts", "BricolageGrotesque.ttf"),
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "68px 76px",
        background: "#f2e9d8",
        color: "#14231f",
        fontFamily: "Bricolage Grotesque",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, fontWeight: 700 }}>
        {SITE_NAME}
      </div>
      <div
        style={{
          maxWidth: 930,
          fontSize: 82,
          fontWeight: 800,
          lineHeight: 0.98,
          letterSpacing: "-4px",
        }}
      >
        Investing, explained without the noise.
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#37564d" }}>
        Plain-English lessons for the long term.
      </div>
      <div
        style={{
          position: "absolute",
          right: 62,
          top: 60,
          width: 130,
          height: 130,
          borderRadius: 65,
          background: "#e9a62b",
        }}
      />
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Bricolage Grotesque",
          data: font,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
