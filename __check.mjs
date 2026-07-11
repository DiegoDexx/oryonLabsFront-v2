import { chromium } from 'playwright-core';
import { execSync } from 'node:child_process';
const executablePath = execSync('find / -maxdepth 8 -iname "chrome" -path "*chromium*" -type f 2>/dev/null | head -1').toString().trim();
const browser = await chromium.launch({ executablePath });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5183/en', { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => document.getElementById('comparison').scrollIntoView());
await page.waitForTimeout(300);
const info = await page.evaluate(() => {
  const thead = document.querySelector('table thead');
  const rows = [...thead.querySelectorAll('tr')].map(tr => ({
    cells: tr.children.length,
    text: tr.textContent.trim(),
    height: tr.getBoundingClientRect().height,
  }));
  return rows;
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
