// Regenerate the brand assets in public/: mark.svg (header, via BrandMark), favicon.svg,
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
// Geometry and colors for every version of the mark. The header's BrandMark
// component reads the same file, so the assets and the header can't drift.
import brand from "../src/data/brand.json" with { type: "json" };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");

const { paper: COLOR_PAPER, grid: COLOR_GRID, ink: COLOR_INK, mark: COLOR_MARK } = brand.colors;

function loadFont(relPath) {
  const buf = readFileSync(path.join(root, "node_modules", relPath));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
}

const caveatBold = loadFont("@fontsource/caveat/files/caveat-latin-700-normal.woff");
const plexSansBold = loadFont("@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-700-normal.woff");

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

// --- The mark: red "cp" on a graph-paper tile with a navy border and a hard
// navy shadow down and to the right. The canvas is tile + shadow, so nothing
// clips. ---
/**
 * The mark's SVG body on a (tile + shadow)-unit canvas. `grid` draws the
 * graph-paper lines; the favicon drops them, since at 16–32px they turn to mush.
 */
function markBody({ tile, border, shadow, glyphBox, grid = false, gridStep = 8, gridStroke = 0.75 }) {
  const gridLines = grid
    ? Array.from({ length: Math.floor(tile / gridStep) - 1 }, (_, i) => (i + 1) * gridStep)
        .map((p) => `<path d="M${p} 0V${tile}M0 ${p}H${tile}" stroke="${COLOR_GRID}" stroke-width="${gridStroke}" />`)
        .join("")
    : "";
  const inset = border / 2;
  return `<rect x="${shadow}" y="${shadow}" width="${tile}" height="${tile}" fill="${COLOR_INK}" />
  <rect width="${tile}" height="${tile}" fill="${COLOR_PAPER}" />${gridLines}
  <rect x="${inset}" y="${inset}" width="${tile - border}" height="${tile - border}" fill="none" stroke="${COLOR_INK}" stroke-width="${border}" />
  <path d="${fittedText(caveatBold, "cp", tile / 2, tile / 2, ...glyphBox)}" fill="${COLOR_MARK}" />`;
}

const MARK = { ...brand.mark, grid: true };
const MARK_CANVAS = MARK.tile + MARK.shadow;
const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK_CANVAS} ${MARK_CANVAS}">
  ${markBody(MARK)}
</svg>
`;
writeFileSync(path.join(publicDir, "mark.svg"), markSvg);

// --- Favicon: same mark, no grid, thicker border. The shadow keeps the
// mark's ratio but rounds to whole pixels at 16px (2 units on the 32-unit
// canvas = 1px at 16px, 2px at 32px), so it stays crisp. ---
const FAVICON_CANVAS = brand.favicon.canvas;
const UNITS_PER_16PX = FAVICON_CANVAS / 16;
const shadowRatio = brand.mark.shadow / brand.mark.tile;
const faviconShadow =
  UNITS_PER_16PX * Math.max(1, Math.round((FAVICON_CANVAS * shadowRatio) / (1 + shadowRatio) / UNITS_PER_16PX));
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${FAVICON_CANVAS} ${FAVICON_CANVAS}">
  ${markBody({
    tile: FAVICON_CANVAS - faviconShadow,
    border: brand.favicon.border,
    shadow: faviconShadow,
    glyphBox: brand.favicon.glyphBox,
  })}
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

// --- Apple touch icon: the full mark, grid and shadow included, centered on
// paper. iOS fills transparency with black and rounds the corners, so the
// icon is opaque with margin around the mark. ---
const TOUCH_SIZE = 180;
const TOUCH_MARK = 136;
const touchOffset = (TOUCH_SIZE - TOUCH_MARK) / 2;
const appleTouchSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TOUCH_SIZE}" height="${TOUCH_SIZE}" viewBox="0 0 ${TOUCH_SIZE} ${TOUCH_SIZE}">
  <rect width="${TOUCH_SIZE}" height="${TOUCH_SIZE}" fill="${COLOR_PAPER}" />
  <svg x="${touchOffset}" y="${touchOffset}" width="${TOUCH_MARK}" height="${TOUCH_MARK}" viewBox="0 0 ${MARK_CANVAS} ${MARK_CANVAS}">
    ${markBody(MARK)}
  </svg>
</svg>`;
const appleTouchIcon = await sharp(Buffer.from(appleTouchSvg), { density: 288 }).png().toBuffer();
writeFileSync(path.join(publicDir, "apple-touch-icon.png"), appleTouchIcon);

// --- OG image: 1200x630 graph paper, mark on the left, name beside it ---
const MARK_X = 120;
const MARK_SIZE = 220; // the tile; the shadow adds MARK_SIZE * shadowRatio
const MARK_Y = (630 - MARK_SIZE) / 2;
const OG_MARK_CANVAS = (MARK_SIZE * MARK_CANVAS) / MARK.tile;
const TEXT_X = MARK_X + MARK_SIZE + 64;
const TEXT_WIDTH = 1200 - TEXT_X - 96;

const nameSize = Math.min(88, (88 * TEXT_WIDTH) / plexSansBold.getAdvanceWidth("Christopher Pombo", 88));
// Center the name's cap height on the mark.
const capHeight = (plexSansBold.tables.os2.sCapHeight / plexSansBold.unitsPerEm) * nameSize;
const nameBaseline = MARK_Y + MARK_SIZE / 2 + capHeight / 2;

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M24 0H0V24" fill="none" stroke="${COLOR_GRID}" stroke-width="2" />
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="${COLOR_PAPER}" />
  <rect width="1200" height="630" fill="url(#grid)" />
  <svg x="${MARK_X}" y="${MARK_Y}" width="${OG_MARK_CANVAS}" height="${OG_MARK_CANVAS}" viewBox="0 0 ${MARK_CANVAS} ${MARK_CANVAS}">
    ${markBody(MARK)}
  </svg>
  <path d="${textAt(plexSansBold, "Christopher Pombo", TEXT_X, nameBaseline, nameSize)}" fill="${COLOR_INK}" />
</svg>`;

writeFileSync(path.join(publicDir, "og-image.png"), await sharp(Buffer.from(ogSvg)).png().toBuffer());

console.log("Generated: mark.svg, favicon.svg, favicon.ico, apple-touch-icon.png, og-image.png");
