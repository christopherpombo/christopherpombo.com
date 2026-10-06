// One-off script: regenerate public/favicon.svg, favicon.ico, apple-touch-icon.png,
// and og-image.png from the brand tokens. Run with `node scripts/generate-brand-assets.mjs`
// whenever the brand mark or OG copy changes — outputs are committed static assets,
// not generated at build time.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");

const COLOR_PAPER = "#f7f9fc";
const COLOR_GRID = "#dce5f2";
const COLOR_INK = "#1c2b4a";
const COLOR_MUTED = "#4a5878";
const COLOR_ACCENT = "#b23a31";

function fontBase64(relPath) {
  return readFileSync(path.join(root, "node_modules", relPath)).toString("base64");
}

const plexSansBold = fontBase64("@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-700-normal.woff2");
const plexMono = fontBase64("@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-600-normal.woff2");

const fontFaces = `
  <style>
    @font-face {
      font-family: 'IBM Plex Sans';
      font-weight: 700;
      src: url(data:font/woff2;base64,${plexSansBold}) format('woff2');
    }
    @font-face {
      font-family: 'IBM Plex Mono';
      font-weight: 600;
      src: url(data:font/woff2;base64,${plexMono}) format('woff2');
    }
  </style>
`;

// --- Favicon: navy-bordered white square with a red check mark ---
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect x="1.5" y="1.5" width="29" height="29" fill="#ffffff" stroke="${COLOR_INK}" stroke-width="3" />
  <path d="M8.5 16.5l5 5 10-11" fill="none" stroke="${COLOR_ACCENT}" stroke-width="3.5" stroke-linecap="square" />
</svg>`;

writeFileSync(path.join(publicDir, "favicon.svg"), faviconSvg);

const favicon32 = await sharp(Buffer.from(faviconSvg)).resize(32, 32).png().toBuffer();
const favicon16 = await sharp(Buffer.from(faviconSvg)).resize(16, 16).png().toBuffer();
const appleTouchIcon = await sharp(Buffer.from(faviconSvg)).resize(180, 180).png().toBuffer();

writeFileSync(path.join(publicDir, "apple-touch-icon.png"), appleTouchIcon);

// --- favicon.ico: minimal ICO container wrapping a PNG-compressed image (widely supported) ---
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

const ico = buildIco([
  { size: 16, data: favicon16 },
  { size: 32, data: favicon32 },
]);
writeFileSync(path.join(publicDir, "favicon.ico"), ico);

// --- OG image: 1200x630 graph paper, red label, name, subtitle ---
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  ${fontFaces}
  <defs>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M24 0H0V24" fill="none" stroke="${COLOR_GRID}" stroke-width="2" />
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="${COLOR_PAPER}" />
  <rect width="1200" height="630" fill="url(#grid)" />
  <text x="120" y="250" font-family="IBM Plex Mono" font-weight="600" font-size="24" letter-spacing="4" fill="${COLOR_ACCENT}">CHRISTOPHERPOMBO.COM</text>
  <text x="116" y="340" font-family="IBM Plex Sans" font-weight="700" font-size="84" fill="${COLOR_INK}">Christopher Pombo</text>
  <text x="120" y="404" font-family="IBM Plex Mono" font-weight="600" font-size="26" letter-spacing="3" fill="${COLOR_MUTED}">2D LT, USAF  /  iOS DEVELOPER  /  RUNNER</text>
</svg>`;

const ogImage = await sharp(Buffer.from(ogSvg)).png().toBuffer();
writeFileSync(path.join(publicDir, "og-image.png"), ogImage);

console.log("Generated: favicon.svg, favicon.ico, apple-touch-icon.png, og-image.png");
