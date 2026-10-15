import type { MetadataRoute } from "next";

import { lessons, manualLessons } from "@/lib/lessons";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/manual",
    "/markets",
    "/news",
    "/glossary",
    "/tools",
    "/learn",
    "/about",
    "/disclaimer",
    "/privacy",
    "/terms",
  ];
  const lessonPages = [...lessons, ...manualLessons].map(
    (lesson) => `/lessons/${lesson.slug}`,
  );

  return [...pages, ...lessonPages].map((path) => ({
    url: new URL(path, SITE_URL).toString(),
  }));
}
