import type { MetadataRoute } from "next";

import { lessons, manualLessons } from "@/lib/lessons";
import { learningPaths } from "@/content/paths";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/manual",
    "/paths",
    "/markets",
    "/news",
    "/glossary",
    "/tools",
    "/risk-quiz",
    "/learn",
    "/about",
    "/disclaimer",
    "/privacy",
    "/terms",
  ];
  const lessonPages = [...lessons, ...manualLessons].map(
    (lesson) => `/lessons/${lesson.slug}`,
  );
  const pathPages = learningPaths.map((path) => `/paths/${path.slug}`);

  return [...pages, ...pathPages, ...lessonPages].map((path) => ({
    url: new URL(path, SITE_URL).toString(),
  }));
}
