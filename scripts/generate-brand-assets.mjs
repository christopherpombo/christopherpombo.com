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

const COLOR_BG = "#e7e1d6";
const COLOR_ACCENT = "#3f6b45";
const COLOR_TEXT = "#1f1f1f";
const COLOR_TEXT_MUTED = "#5c5c5c";

function fontBase64(relPath) {
  return readFileSync(path.join(root, "node_modules", relPath)).toString("base64");
}

const poppinsBold = fontBase64("@fontsource/poppins/files/poppins-latin-700-normal.woff2");
const mulishMedium = fontBase64("@fontsource/mulish/files/mulish-latin-500-normal.woff2");

const fontFaces = `
  <style>
    @font-face {
      font-family: 'Poppins';
      font-weight: 700;
      src: url(data:font/woff2;base64,${poppinsBold}) format('woff2');
    }
    @font-face {
      font-family: 'Mulish';
      font-weight: 500;
      src: url(data:font/woff2;base64,${mulishMedium}) format('woff2');
    }
  </style>
`;

// --- Favicon: white rounded square backdrop + green square brand mark ---
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#ffffff" />
  <rect x="9" y="9" width="14" height="14" fill="${COLOR_ACCENT}" />
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

// --- OG image: 1200x630, beige bg, green square + name + subtitle ---
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  ${fontFaces}
  <rect width="1200" height="630" fill="${COLOR_BG}" />
  <rect x="120" y="216" width="40" height="40" fill="${COLOR_ACCENT}" />
  <text x="176" y="252" font-family="Poppins" font-weight="700" font-size="64" fill="${COLOR_TEXT}">Christopher Pombo</text>
  <text x="122" y="320" font-family="Mulish" font-weight="500" font-size="28" letter-spacing="3" fill="${COLOR_TEXT_MUTED}">2D LT, U.S. AIR FORCE  /  iOS DEVELOPER</text>
</svg>`;

const ogImage = await sharp(Buffer.from(ogSvg)).png().toBuffer();
writeFileSync(path.join(publicDir, "og-image.png"), ogImage);

console.log("Generated: favicon.svg, favicon.ico, apple-touch-icon.png, og-image.png");
