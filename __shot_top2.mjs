import { chromium } from 'playwright-core';
import { execSync } from 'node:child_process';
const executablePath = execSync('find / -maxdepth 8 -iname "chrome" -path "*chromium*" -type f 2>/dev/null | head -1').toString().trim();
const browser = await chromium.launch({ executablePath });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5183/en', { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => {
  const table = document.querySelector('table');
  const y = table.getBoundingClientRect().top + window.scrollY - 100;
  window.scrollTo(0, y);
});
await page.waitForTimeout(400);
await page.screenshot({ path: '/tmp/shots/table_viewport_top2.png' });
await browser.close();
