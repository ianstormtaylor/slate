const readUi = adb => {
  const output = adb(
    'shell',
    'uiautomator',
    'dump',
    '--windows',
    '/sdcard/slate-device-ui.xml'
  )
  if (!output.includes('UI hierchary dumped to:'))
    throw new Error('Android UI dump did not complete')
  const xml = adb('exec-out', 'cat', '/sdcard/slate-device-ui.xml')
  return Array.from(xml.matchAll(/<node\s([^>]+)>/g), match => {
    const node = Object.fromEntries(
      Array.from(match[1].matchAll(/([\w-]+)="([^"]*)"/g), ([, key, value]) => [
        key,
        value,
      ])
    )
    const bounds = /\[(-?\d+),(-?\d+)\]\[(-?\d+),(-?\d+)\]/.exec(node.bounds)
    if (bounds) node.rect = bounds.slice(1).map(Number)
    return node
  })
}

const tapKey = (adb, key) => {
  const node = readUi(adb).find(
    node =>
      node.package === 'com.google.android.inputmethod.latin' &&
      node['content-desc'].toLowerCase() === key.toLowerCase() &&
      node.rect &&
      node.rect[2] > node.rect[0] &&
      node.rect[3] > node.rect[1]
  )
  if (!node)
    throw new Error(
      `Gboard key ${JSON.stringify(key)} is not visible in the UI dump`
    )
  const [left, top, right, bottom] = node.rect
  adb(
    'shell',
    'input',
    'tap',
    String(Math.round((left + right) / 2)),
    String(Math.round((top + bottom) / 2))
  )
}

const tapLocator = async (page, locator, adb, cdp = false) => {
  await locator.scrollIntoViewIfNeeded()
  const toolbar =
    !cdp &&
    readUi(adb).find(
      node => node['resource-id'] === 'com.android.chrome:id/toolbar_hairline'
    )
  if (!cdp && !toolbar?.rect) throw new Error('Chrome toolbar bounds missing')
  const point = await locator.evaluate(element => {
    const viewport = visualViewport
    for (const rect of element.getClientRects()) {
      const left = Math.max(rect.left, viewport.offsetLeft)
      const right = Math.min(rect.right, viewport.offsetLeft + viewport.width)
      const top = Math.max(rect.top, viewport.offsetTop)
      const bottom = Math.min(rect.bottom, viewport.offsetTop + viewport.height)
      if (right <= left || bottom <= top) continue
      const x = (left + right) / 2
      const y = (top + bottom) / 2
      if (!element.contains(document.elementFromPoint(x, y))) continue
      return {
        x: x - viewport.offsetLeft,
        y: y - viewport.offsetTop,
        scale: devicePixelRatio * viewport.scale,
      }
    }
    throw new Error('tap target has no visible hit-testable rectangle')
  })
  await locator.evaluate(element => {
    window.__slateDeviceTap = null
    window.__slateDeviceClick = false
    element.addEventListener(
      'click',
      () => {
        window.__slateDeviceClick = true
      },
      { once: true, capture: true }
    )
    element.addEventListener(
      'pointerdown',
      event => {
        window.__slateDeviceTap = {
          trusted: event.isTrusted,
          type: event.pointerType,
        }
      },
      { once: true }
    )
  })
  if (cdp) {
    const session = await page.context().newCDPSession(page)
    try {
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ x: point.x, y: point.y }],
      })
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchEnd',
        touchPoints: [],
      })
    } finally {
      await session.detach()
    }
  } else {
    adb(
      'shell',
      'input',
      'tap',
      String(Math.round(point.x * point.scale)),
      String(Math.round(toolbar.rect[3] + point.y * point.scale))
    )
  }
  const touch = await page
    .waitForFunction(() => window.__slateDeviceTap, null, { timeout: 2000 })
    .then(handle => handle.jsonValue())
    .catch(() => null)
  if (!touch?.trusted || touch.type !== 'touch')
    throw new Error('touch did not reach the expected target')
  await page.waitForFunction(() => window.__slateDeviceClick, null, {
    timeout: 2000,
  })
}

module.exports = { readUi, tapKey, tapLocator }
