import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
// Use globally installed playwright
const { chromium } = require('/Users/sig32/.nvm/versions/node/v20.19.5/lib/node_modules/playwright');

const BASE = 'http://127.0.0.1:8080';
const PAGES = ['index.html', 'how-it-works.html', 'register.html', 'swarm.html'];

let browser, context;

before(async () => {
  browser = await chromium.launch();
  context = await browser.newContext();
});

after(async () => {
  await context?.close();
  await browser?.close();
});

describe('page loads', () => {
  for (const page of PAGES) {
    it(`${page} returns 200`, async () => {
      const p = await context.newPage();
      const res = await p.goto(`${BASE}/${page}`, { waitUntil: 'domcontentloaded' });
      assert.strictEqual(res.status(), 200);
      await p.close();
    });
  }
});

describe('index.html structure', () => {
  it('has the #dos game container', async () => {
    const page = await context.newPage();
    await page.goto(`${BASE}/index.html`, { waitUntil: 'domcontentloaded' });
    const dos = await page.$('#dos');
    assert.ok(dos, 'missing #dos element');
    await page.close();
  });

  it('has all expected buttons', async () => {
    const page = await context.newPage();
    await page.goto(`${BASE}/index.html`, { waitUntil: 'domcontentloaded' });
    const buttons = await page.$$eval('.btn', els => els.map(e => e.textContent.trim()));
    for (const label of ['FULL [F]', 'DOCS [H]', 'TECH [T]', 'SWARM [W]', 'NAG [N]']) {
      assert.ok(buttons.some(b => b.includes(label)), `missing button: ${label}`);
    }
    await page.close();
  });
});

describe('how-it-works.html', () => {
  it('has a nav link back to index', async () => {
    const page = await context.newPage();
    await page.goto(`${BASE}/how-it-works.html`, { waitUntil: 'domcontentloaded' });
    const link = await page.$('a[href="index.html"]');
    assert.ok(link, 'missing link back to index.html');
    await page.close();
  });
});

describe('mobile layout (375x667)', () => {
  it('header buttons fit without overflow', async () => {
    const page = await context.newPage();
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE}/index.html`, { waitUntil: 'domcontentloaded' });
    const header = await page.$('.header');
    const headerBox = await header.boundingBox();
    // header should not exceed viewport width
    assert.ok(headerBox.width <= 375, `header overflows: ${headerBox.width}px`);
    // Logo should be hidden
    const logo = await page.$eval('#logo', el =>
      getComputedStyle(el).display
    );
    assert.strictEqual(logo, 'none', 'logo should be hidden on mobile');
    await page.close();
  });
});
