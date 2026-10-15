import "server-only";

import { cacheLife } from "next/cache";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export type LessonFrontmatter = {
  title: string;
  description: string;
};

const lessonFiles: Record<string, string> = {
  "why-invest": "01-why-invest.mdx",
  "asset-classes": "asset-classes.mdx",
  "risk-return-and-diversification": "risk-return-and-diversification.mdx",
  "funds-index-funds-and-etfs": "funds-index-funds-and-etfs.mdx",
  "accounts-and-taxes": "accounts-and-taxes.mdx",
  "costs-and-fees": "costs-and-fees.mdx",
  "investor-psychology": "investor-psychology.mdx",
  "building-a-simple-plan": "building-a-simple-plan.mdx",
  "manual-what-is-a-stock": "manual-what-is-a-stock.mdx",
  "manual-how-markets-work": "manual-how-markets-work.mdx",
  "manual-order-types": "manual-order-types.mdx",
  "manual-reading-quotes": "manual-reading-quotes.mdx",
  "manual-reading-charts": "manual-reading-charts.mdx",
  "manual-diversification": "manual-diversification.mdx",
  "manual-position-sizing": "manual-position-sizing.mdx",
  "manual-fees-and-taxes": "manual-fees-and-taxes.mdx",
  "manual-beginner-mistakes": "manual-beginner-mistakes.mdx",
};

export async function getLessonFrontmatter(
  slug: string,
): Promise<LessonFrontmatter | null> {
  "use cache";
  cacheLife("max");

  const filename = lessonFiles[slug];
  if (!filename) {
    return null;
  }

  const source = await readFile(
    join(process.cwd(), "content", "lessons", filename),
    "utf8",
  );
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) {
    throw new Error(`Missing YAML frontmatter in lesson: ${filename}`);
  }

  const fields = new Map<string, string>();
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^(title|description):\s*(.+)$/);
    if (field) {
      fields.set(field[1], field[2].replace(/^["']|["']$/g, ""));
    }
  }

  const title = fields.get("title");
  const description = fields.get("description");
  if (!title || !description) {
    throw new Error(`Lesson frontmatter needs title and description: ${filename}`);
  }

  return { title, description };
}
