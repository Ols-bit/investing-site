import type { Metadata } from "next";

export const SITE_NAME = "Fieldnotes";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://fieldnotes.example";

export function createPageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const image = path === "/" ? "/opengraph-image" : `${path}/opengraph-image`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: `${title} | ${SITE_NAME}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
