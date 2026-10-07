/** Highlighter-marker colors, matching the App Store screenshot captions. */
export const highlightColors = ["yellow", "green", "blue", "pink", "orange", "purple"] as const;
export type HighlightColor = (typeof highlightColors)[number];

export interface HighlightOptions {
  word: string;
  color: HighlightColor;
}

/**
 * Splits `text` around the first whole-word match of `word` (case-insensitive)
 * so the match can be wrapped in <Highlight>. Throws when the word isn't there,
 * so a typo in a page or in frontmatter fails the build instead of quietly
 * dropping the highlight.
 */
export function splitOnWord(text: string, word: string): [string, string, string] {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`\\b${escaped}\\b`, "i").exec(text);
  if (!match) throw new Error(`Highlight word "${word}" not found in "${text}"`);
  const end = match.index + match[0].length;
  return [text.slice(0, match.index), match[0], text.slice(end)];
}
