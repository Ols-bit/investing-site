import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { getLessonFrontmatter } from "@/lib/lesson-frontmatter";
import { SITE_NAME } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function LessonOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = await getLessonFrontmatter(slug);
  const font = await readFile(
    join(process.cwd(), "assets", "fonts", "ArchivoBlack-Regular.ttf"),
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
        fontFamily: "Archivo Black",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, fontWeight: 400 }}>
        {SITE_NAME.slice(0, 6)}
        <span style={{ position: "relative" }}>
          {SITE_NAME[6]}
          <span
            style={{
              position: "absolute",
              width: 8,
              height: 8,
              left: "42%",
              top: "44%",
              background: "#d8eb68",
            }}
          />
        </span>
        {SITE_NAME.slice(7)} / THE MANUAL
      </div>
      <div
        style={{
          maxWidth: 1020,
          fontSize: lesson && lesson.title.length > 36 ? 68 : 86,
          fontWeight: 400,
          lineHeight: 1,
          letterSpacing: "-3px",
        }}
      >
        {lesson?.title ?? "Investing lesson"}
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#37564d" }}>
        Plain-English investing education
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
          name: "Archivo Black",
          data: font,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
