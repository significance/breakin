import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const errors = [];
const logs = [];
page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
page.on('pageerror', err => errors.push(err.message));

await page.goto('http://127.0.0.1:8090/', { waitUntil: 'networkidle', timeout: 15000 }).catch(e => errors.push('Navigation: ' + e.message));

// Wait a bit for js-dos to initialize
await page.waitForTimeout(5000);

await page.screenshot({ path: '/Users/sig32/Code/breakanoid/screenshot.png', fullPage: true });

console.log('=== CONSOLE LOGS ===');
logs.forEach(l => console.log(l));
console.log('\n=== JS ERRORS ===');
if (errors.length === 0) console.log('None');
else errors.forEach(e => console.log(e));

await browser.close();
