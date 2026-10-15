// Renders the README preview (assets/img/preview-{dark,light}.webp) and the
// social card (assets/img/social.jpg) from index.html.
//   npm install && npx playwright install chromium && node scripts/render.mjs
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('../', import.meta.url));
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = createServer(async (req, res) => {
  const p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([/\\])+/, '') || 'index.html';
  try { res.writeHead(200, { 'Content-Type': types[extname(p)] || 'application/octet-stream' }).end(await readFile(join(root, p))); }
  catch { res.writeHead(404).end(); }
}).listen(0);
const base = `http://127.0.0.1:${server.address().port}/`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
const encode = async (png, type, q) => Buffer.from(await page.evaluate(async ([b64, type, q]) => {
  const i = new Image(); i.src = 'data:image/png;base64,' + b64; await i.decode();
  const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; c.getContext('2d').drawImage(i, 0, 0);
  return c.toDataURL(type, q).split(',')[1];
}, [png.toString('base64'), type, q]), 'base64');

for (const theme of ['dark', 'light']) {
  await page.goto(`${base}?shot&lang=en&theme=${theme}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const png = await page.screenshot({ clip: { x: 0, y: 0, width: 1280, height: 1500 }, fullPage: true });
  await writeFile(join(root, `assets/img/preview-${theme}.webp`), await encode(png, 'image/webp', 0.85));
  if (process.env.FULL) await page.screenshot({ path: `${process.env.FULL}/portfolio-${theme}.png`, fullPage: true });
  console.log('preview', theme);
}
await page.setViewportSize({ width: 1200, height: 630 });
await page.goto(`${base}?shot&lang=en&theme=dark`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await writeFile(join(root, 'assets/img/social.jpg'), await encode(await page.screenshot(), 'image/jpeg', 0.88));
console.log('social');
await browser.close(); server.close();
