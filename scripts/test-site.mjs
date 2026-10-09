import { chromium } from 'playwright';
import * as fs from 'fs';

async function runTests() {
  const browser = await chromium.launch();
  
  // 1. Desktop test (1440x900)
  const contextDesktop = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const pageDesktop = await contextDesktop.newPage();
  await pageDesktop.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await pageDesktop.waitForTimeout(1000);
  
  const desktopOverflow = await pageDesktop.evaluate(() => {
    return document.documentElement.scrollWidth === window.innerWidth;
  });
  console.log(`Desktop No Overflow (1440x900): ${desktopOverflow}`);
  
  await pageDesktop.screenshot({ path: 'd:/portfolio/screenshot-desktop.png', fullPage: true });
  console.log('Saved screenshot-desktop.png');

  // 2. Mobile test (390x844)
  const contextMobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true
  });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await pageMobile.waitForTimeout(1000);

  const mobileOverflow = await pageMobile.evaluate(() => {
    return document.documentElement.scrollWidth === window.innerWidth;
  });
  console.log(`Mobile No Overflow (390x844): ${mobileOverflow}`);

  await pageMobile.screenshot({ path: 'd:/portfolio/screenshot-mobile.png', fullPage: true });
  console.log('Saved screenshot-mobile.png');

  await browser.close();
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
