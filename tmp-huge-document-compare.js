const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  await page.goto('http://localhost:3002/examples/huge-document', {
    waitUntil: 'networkidle',
  });

  console.log(
    JSON.stringify(
      {
        title: await page.title(),
        url: page.url(),
      },
      null,
      2
    )
  );

  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
