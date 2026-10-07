import { getCollection, type CollectionEntry } from "astro:content";

/** Published projects (drafts left out) in list order. Every page lists projects through this. */
export async function publishedProjects(): Promise<CollectionEntry<"projects">[]> {
  const projects = await getCollection("projects", ({ data }) => !data.draft);
  return projects.sort(
    (a, b) => (a.data.order ?? 99) - (b.data.order ?? 99) || b.data.date.valueOf() - a.data.date.valueOf()
  );
}
