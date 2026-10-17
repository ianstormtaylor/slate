const assert = require('node:assert/strict')
const { test } = require('node:test')
const { chromium } = require('@playwright/test')
const { tapLocator } = require('./touch.cjs')

test('taps a wrapped inline whose bounding-box center falls between lines', async () => {
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({
      viewport: { width: 400, height: 400 },
      hasTouch: true,
    })
    await page.setContent(
      '<p style="font:20px/40px sans-serif"><span id="target">First line<br>Second line</span></p>'
    )
    const target = page.locator('#target')
    assert.equal(
      await target.evaluate(element => {
        const rect = element.getBoundingClientRect()
        return element.contains(
          document.elementFromPoint(
            rect.x + rect.width / 2,
            rect.y + rect.height / 2
          )
        )
      }),
      false
    )
    await tapLocator(page, target, null, true)
    assert.deepEqual(await page.evaluate(() => window.__slateDeviceTap), {
      trusted: true,
      type: 'touch',
    })
  } finally {
    await browser.close()
  }
})
