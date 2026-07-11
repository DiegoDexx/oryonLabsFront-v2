import { chromium } from 'playwright-core';
import { execSync } from 'node:child_process';
const executablePath = execSync('find / -maxdepth 8 -iname "chrome" -path "*chromium*" -type f 2>/dev/null | head -1').toString().trim();
const browser = await chromium.launch({ executablePath });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5183/en', { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
const height = await page.evaluate(() => document.body.scrollHeight);
let y = 0;
while (y < height) { y += 400; await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(100); }
await page.waitForTimeout(300);
const targetY = await page.evaluate(() => {
  const table = document.querySelector('table');
  return table.getBoundingClientRect().top + window.scrollY - 90;
});
await page.evaluate((yy) => window.scrollTo(0, yy), targetY);
await page.waitForTimeout(400);
await page.screenshot({ path: '/tmp/shots/table_viewport_top3.png' });
await page.evaluate(() => window.scrollBy(0, 850));
await page.waitForTimeout(400);
await page.screenshot({ path: '/tmp/shots/table_viewport_mid3.png' });
await page.evaluate(() => window.scrollBy(0, 850));
await page.waitForTimeout(400);
await page.screenshot({ path: '/tmp/shots/table_viewport_bottom3.png' });
await browser.close();
