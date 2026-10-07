// Regenerate the brand assets in public/: mark.svg (header), favicon.svg,
// favicon.ico, apple-touch-icon.png, and og-image.png. Run with
// `npm run generate-assets` whenever the mark or OG copy changes — outputs are
// committed static assets, not generated at build time.
//
// All text is converted to vector outlines with opentype.js. sharp's SVG
// renderer ignores embedded @font-face fonts (it silently falls back to a
// system sans), and outlines also keep favicon.svg self-contained in browsers.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import opentype from "opentype.js";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");

const COLOR_PAPER = "#f7f9fc";
const COLOR_GRID = "#dce5f2";
const COLOR_INK = "#1c2b4a";
const COLOR_MUTED = "#4a5878";
const COLOR_MARK = "#c8453b";
const COLOR_ACCENT = "#b23a31";

function loadFont(relPath) {
  const buf = readFileSync(path.join(root, "node_modules", relPath));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
}

const caveatBold = loadFont("@fontsource/caveat/files/caveat-latin-700-normal.woff");
const plexSansBold = loadFont("@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-700-normal.woff");
const plexSansSemibold = loadFont("@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff");
const plexMonoSemibold = loadFont("@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-600-normal.woff");

// opentype.js's own toPathData() emits "NaN" for some curves (its path
// optimizer), which makes renderers stop drawing partway through a glyph.
function pathData(path) {
  const n = (v) => +v.toFixed(2);
  return path.commands
    .map((c) => {
      switch (c.type) {
        case "M":
        case "L":
          return `${c.type}${n(c.x)} ${n(c.y)}`;
        case "Q":
          return `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`;
        case "C":
          return `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`;
        default:
          return "Z";
      }
    })
    .join("");
}

/** Path data for `text`, scaled to fit inside a w×h box centered on (cx, cy). */
function fittedText(font, text, cx, cy, w, h) {
  const box = font.getPath(text, 0, 0, 100).getBoundingBox();
  const scale = Math.min(w / (box.x2 - box.x1), h / (box.y2 - box.y1));
  const x = cx - ((box.x1 + box.x2) / 2) * scale;
  const y = cy - ((box.y1 + box.y2) / 2) * scale;
  return pathData(font.getPath(text, x, y, 100 * scale));
}

/** Path data for `text` with its baseline starting at (x, y); `letterSpacing` is in em. */
function textAt(font, text, x, y, size, letterSpacing = 0) {
  return pathData(font.getPath(text, x, y, size, { letterSpacing }));
}

// --- The mark: red "cp" on a graph-paper tile with a navy border (64-unit grid) ---
function markContents({ grid }) {
  const gridLines = grid
    ? Array.from({ length: 7 }, (_, i) => (i + 1) * 8)
        .map((p) => `<path d="M${p} 0V64M0 ${p}H64" stroke="${COLOR_GRID}" stroke-width="0.75" />`)
        .join("")
    : "";
  return `<rect width="64" height="64" fill="${COLOR_PAPER}" />${gridLines}
  <rect x="1.5" y="1.5" width="61" height="61" fill="none" stroke="${COLOR_INK}" stroke-width="3" />
  <path d="${fittedText(caveatBold, "cp", 32, 32, 40, 40)}" fill="${COLOR_MARK}" />`;
}

const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  ${markContents({ grid: true })}
</svg>
`;
writeFileSync(path.join(publicDir, "mark.svg"), markSvg);

// --- Favicon: at 16–32px the grid turns to mush, so drop it, thicken the
// border (4 units = whole pixels at both 16 and 32px), and let "cp" fill
// most of the tile. ---
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="${COLOR_PAPER}" />
  <rect x="2" y="2" width="28" height="28" fill="none" stroke="${COLOR_INK}" stroke-width="4" />
  <path d="${fittedText(caveatBold, "cp", 16, 16, 22, 21)}" fill="${COLOR_MARK}" />
</svg>
`;
writeFileSync(path.join(publicDir, "favicon.svg"), faviconSvg);

const favicon16 = await sharp(Buffer.from(faviconSvg), { density: 384 }).resize(16, 16).png().toBuffer();
const favicon32 = await sharp(Buffer.from(faviconSvg), { density: 384 }).resize(32, 32).png().toBuffer();

// --- favicon.ico: minimal ICO container wrapping PNG-compressed images ---
function buildIco(pngBuffers) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngBuffers.length, 4); // image count

  let offset = 6 + pngBuffers.length * 16;
  const entries = [];
  const images = [];

  for (const { size, data } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size === 256 ? 0 : size, 0); // width (0 = 256)
    entry.writeUInt8(size === 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // color palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8); // image data size
    entry.writeUInt32LE(offset, 12); // image data offset
    offset += data.length;
    entries.push(entry);
    images.push(data);
  }

  return Buffer.concat([header, ...entries, ...images]);
}

writeFileSync(
  path.join(publicDir, "favicon.ico"),
  buildIco([
    { size: 16, data: favicon16 },
    { size: 32, data: favicon32 },
  ])
);

// --- Apple touch icon: the full mark, grid included ---
const appleTouchIcon = await sharp(Buffer.from(markSvg), { density: 576 }).resize(180, 180).png().toBuffer();
writeFileSync(path.join(publicDir, "apple-touch-icon.png"), appleTouchIcon);

// --- OG image: 1200x630 graph paper, mark on the left, name + the featured app ---
const MARK_X = 120;
const MARK_SIZE = 220;
const MARK_Y = (630 - MARK_SIZE) / 2;
const TEXT_X = MARK_X + MARK_SIZE + 64;
const TEXT_WIDTH = 1200 - TEXT_X - 96;

const FEATURED_APP = "Simply Spend";
const nameSize = Math.min(76, (76 * TEXT_WIDTH) / plexSansBold.getAdvanceWidth("Christopher Pombo", 76));
const labelSize = 22;
const appSize = 44;
// Name, then a red mono "FEATURED APP" label, then the app's name, centered on the mark.
const nameBaseline = MARK_Y + 70;
const labelBaseline = nameBaseline + 76;
const appBaseline = labelBaseline + 58;

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M24 0H0V24" fill="none" stroke="${COLOR_GRID}" stroke-width="2" />
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="${COLOR_PAPER}" />
  <rect width="1200" height="630" fill="url(#grid)" />
  <rect x="${MARK_X + 10}" y="${MARK_Y + 10}" width="${MARK_SIZE}" height="${MARK_SIZE}" fill="${COLOR_INK}" />
  <svg x="${MARK_X}" y="${MARK_Y}" width="${MARK_SIZE}" height="${MARK_SIZE}" viewBox="0 0 64 64">
    ${markContents({ grid: true })}
  </svg>
  <path d="${textAt(plexSansBold, "Christopher Pombo", TEXT_X, nameBaseline, nameSize)}" fill="${COLOR_INK}" />
  <path d="${textAt(plexMonoSemibold, "FEATURED APP", TEXT_X + 2, labelBaseline, labelSize, 0.12)}" fill="${COLOR_ACCENT}" />
  <path d="${textAt(plexSansSemibold, FEATURED_APP, TEXT_X, appBaseline, appSize)}" fill="${COLOR_MUTED}" />
</svg>`;

writeFileSync(path.join(publicDir, "og-image.png"), await sharp(Buffer.from(ogSvg)).png().toBuffer());

console.log("Generated: mark.svg, favicon.svg, favicon.ico, apple-touch-icon.png, og-image.png");
