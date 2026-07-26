// Audit capture script, 2026-07-26. Run: node capture.mjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/herryanto/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const __dirname = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');

const OUT = __dirname;
const BASE = 'http://localhost:3001';
const EXE = 'D:/Harry/.playwright-cache/chromium-1228/chrome-win64/chrome.exe';

const consoleLines = [];

function hookConsole(page, tag) {
  page.on('console', (msg) => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      consoleLines.push(`[${tag}] [${type}] ${msg.text()}`);
    }
  });
  page.on('pageerror', (err) => consoleLines.push(`[${tag}] [pageerror] ${err.message}`));
}

async function pacedScrollTo(page, targetY, tag) {
  const step = 200;
  let y = await page.evaluate(() => window.scrollY);
  let guard = 0;
  while (Math.abs(y - targetY) > 8 && guard++ < 200) {
    y += Math.sign(targetY - y) * Math.min(step, Math.abs(targetY - y));
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(140);
  }
  await page.waitForTimeout(600);
  y = await page.evaluate(() => window.scrollY);
  consoleLines.push(`[${tag}] scroll settled at y=${Math.round(y)} (target ${Math.round(targetY)})`);
}

async function shot(page, name) {
  await page.screenshot({ path: path.join(OUT, name) });
  console.log('shot:', name);
}

async function scrollPass(page, tag, prefix) {
  const doc = await page.evaluate(() => ({
    h: document.documentElement.scrollHeight,
    vh: window.innerHeight,
  }));
  const maxY = Math.max(0, doc.h - doc.vh);
  consoleLines.push(`[${tag}] scrollHeight=${doc.h} viewport=${doc.vh} maxY=${maxY}`);
  const stops = [0, 0.2, 0.4, 0.6, 0.8, 1].map((f) => Math.round(maxY * f));
  // down
  for (let i = 0; i < stops.length; i++) {
    await pacedScrollTo(page, stops[i], tag);
    await shot(page, `${prefix}-down-${i}.png`);
  }
  // up
  for (let i = stops.length - 2; i >= 0; i--) {
    await pacedScrollTo(page, stops[i], tag);
    await shot(page, `${prefix}-up-${i}.png`);
  }
}

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });

  // 1. Desktop, first visit (boot overlay path)
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  hookConsole(page, 'desktop-home');
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);
  await shot(page, 'desktop-00-boot.png');
  await page.waitForTimeout(7000); // let boot sequence finish
  await page.waitForLoadState('networkidle').catch(() => {});
  await shot(page, 'desktop-01-after-boot.png');
  await scrollPass(page, 'desktop-home', 'desktop');
  await page.screenshot({ path: path.join(OUT, 'desktop-full.png'), fullPage: true });
  console.log('shot: desktop-full.png');

  // 2. Desktop cognitive-log
  await page.goto(`${BASE}/cognitive-log`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  await page.waitForLoadState('networkidle').catch(() => {});
  await shot(page, 'log-desktop-top.png');
  await page.screenshot({ path: path.join(OUT, 'log-desktop-full.png'), fullPage: true });
  console.log('shot: log-desktop-full.png');
  await ctx.close();

  // 3. Mobile 390px
  const mctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });
  const mpage = await mctx.newPage();
  hookConsole(mpage, 'mobile-home');
  await mpage.goto(BASE, { waitUntil: 'domcontentloaded' });
  await mpage.waitForTimeout(8000);
  await mpage.waitForLoadState('networkidle').catch(() => {});
  await shot(mpage, 'mobile-01-after-boot.png');
  await scrollPass(mpage, 'mobile-home', 'mobile');
  await mpage.screenshot({ path: path.join(OUT, 'mobile-full.png'), fullPage: true });
  console.log('shot: mobile-full.png');
  await mpage.goto(`${BASE}/cognitive-log`, { waitUntil: 'domcontentloaded' });
  await mpage.waitForTimeout(2500);
  await shot(mpage, 'log-mobile-top.png');
  await mpage.screenshot({ path: path.join(OUT, 'log-mobile-full.png'), fullPage: true });
  console.log('shot: log-mobile-full.png');
  await mctx.close();

  // 4. Reduced motion
  const rctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const rpage = await rctx.newPage();
  hookConsole(rpage, 'reduced-motion');
  await rpage.goto(BASE, { waitUntil: 'domcontentloaded' });
  await rpage.waitForTimeout(8000);
  await rpage.waitForLoadState('networkidle').catch(() => {});
  await shot(rpage, 'rm-01-top.png');
  const rmax = await rpage.evaluate(
    () => document.documentElement.scrollHeight - window.innerHeight
  );
  await pacedScrollTo(rpage, Math.round(rmax * 0.5), 'reduced-motion');
  await shot(rpage, 'rm-02-mid.png');
  await pacedScrollTo(rpage, rmax, 'reduced-motion');
  await shot(rpage, 'rm-03-bottom.png');
  await rpage.screenshot({ path: path.join(OUT, 'rm-full.png'), fullPage: true });
  console.log('shot: rm-full.png');
  await rctx.close();

  await browser.close();
  fs.writeFileSync(path.join(OUT, 'console-log.txt'), consoleLines.join('\n') || '(no console errors/warnings)');
  console.log('DONE. console lines:', consoleLines.length);
})().catch((e) => {
  console.error('CAPTURE FAILED:', e);
  process.exit(1);
});
