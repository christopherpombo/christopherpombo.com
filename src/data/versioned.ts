import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * A public/ file's URL with a content hash appended. Browsers cache favicons
 * (and other sites cache OG images) by URL for a very long time, so a
 * regenerated brand asset needs a new URL to show up.
 */
export function versioned(publicPath: string): string {
  const file = readFileSync(path.join(process.cwd(), "public", publicPath));
  return `${publicPath}?v=${createHash("sha256").update(file).digest("hex").slice(0, 8)}`;
}
