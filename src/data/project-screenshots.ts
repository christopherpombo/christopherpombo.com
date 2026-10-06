import type { ImageMetadata } from "astro";
import { projectScreenshotAlts } from "./project-screenshot-alts";

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/projects/**/*.{jpg,jpeg,png,webp}",
  { eager: true }
);

/** Screenshots in src/assets/projects/<id>/ (or a lone <id>.png), in filename order. */
export function projectScreenshots(id: string, title: string) {
  return Object.entries(images)
    .filter(([path]) => path.includes(`/${id}/`) || path.includes(`/${id}.`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, mod]) => {
      const key = path.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "";
      const label = key.replace(/^\d+-/, "").replace(/[-_]/g, " ");
      return { image: mod.default, alt: projectScreenshotAlts[`${id}/${key}`] ?? `${title} — ${label} screen` };
    });
}
