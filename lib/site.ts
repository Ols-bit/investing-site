import type { Metadata } from "next";

// Tagline options: "Understand shares, markets, and investment risk."; "Learn how stocks work, without the jargon."; "Markets explained. Risks included."; "Clear lessons on shares and investing."; "Know what you own and what it costs."
export const SITE_NAME = "InvestoLearn";
export const SITE_DESCRIPTION =
  "Understand shares, markets, and investment risk.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://investolearn.example";

export function createPageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const image = "/opengraph-image";

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
