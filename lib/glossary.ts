import glossaryEntries from "@/content/glossary.json";

type GlossarySourceEntry = {
  term: string;
  definition: string;
  explanation?: string;
  aliases?: string[];
};

export type GlossaryEntry = GlossarySourceEntry & { id: string };

export function glossarySlug(term: string) {
  return term
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const glossaryTerms: GlossaryEntry[] = glossaryEntries
  .map((entry) => ({
    ...entry,
    id: glossarySlug(entry.term),
  }))
  .sort((first, second) => first.term.localeCompare(second.term, "en"));

export function findGlossaryEntry(label: string) {
  const normalizedLabel = label.toLowerCase().replace(/[^a-z0-9]/g, "");
  return glossaryTerms.find(
    (entry) =>
      [entry.term, ...(entry.aliases ?? [])].some(
        (labelToMatch) =>
          labelToMatch.toLowerCase().replace(/[^a-z0-9]/g, "") === normalizedLabel,
      ),
  );
}
