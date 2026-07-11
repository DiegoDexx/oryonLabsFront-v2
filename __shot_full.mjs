import { chromium } from 'playwright-core';
import { execSync } from 'node:child_process';
const executablePath = execSync('find / -maxdepth 8 -iname "chrome" -path "*chromium*" -type f 2>/dev/null | head -1').toString().trim();
const browser = await chromium.launch({ executablePath });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5183/en', { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
const height = await page.evaluate(() => document.body.scrollHeight);
let y = 0;
while (y < height) { y += 500; await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(120); }
await page.evaluate(() => document.getElementById('comparativa')?.scrollIntoView() || document.getElementById('comparison')?.scrollIntoView());
await page.waitForTimeout(500);
const box = await page.evaluate(() => {
  const el = document.querySelector('table');
  const r = el.getBoundingClientRect();
  return { top: r.top, bottom: r.bottom, height: r.height, rows: el.rows.length };
});
console.log('table box', box);
await page.screenshot({ path: '/tmp/shots/table_full.png', fullPage: true });
await browser.close();
