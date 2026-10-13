const { execFileSync } = require('child_process')
const { chromium } = require('@playwright/test')
const { tapKey, tapLocator } = require('./android/touch.cjs')
const PORT = process.argv[2] || process.env.SLATE_PORT || 3000
const SERIAL = process.env.ANDROID_SERIAL || 'emulator-5554'
const DEVTOOLS_PORT = process.env.DEVTOOLS_PORT || 9333
const adb = (...a) =>
  execFileSync(
    process.env.HOME + '/Library/Android/sdk/platform-tools/adb',
    ['-s', SERIAL, ...a],
    { encoding: 'utf8' }
  )
const sleep = ms => new Promise(r => setTimeout(r, ms))
;(async () => {
  adb('reverse', `tcp:${PORT}`, `tcp:${PORT}`)
  adb(
    'shell',
    'ime',
    'set',
    'com.google.android.inputmethod.latin/com.android.inputmethod.latin.LatinIME'
  )
  const url = `http://localhost:${PORT}/examples/richtext`
  adb('shell', 'am', 'force-stop', 'com.android.chrome')
  adb(
    'shell',
    'am',
    'start',
    '-a',
    'android.intent.action.VIEW',
    '-d',
    url,
    'com.android.chrome'
  )
  await sleep(5000)
  adb('forward', `tcp:${DEVTOOLS_PORT}`, 'localabstract:chrome_devtools_remote')
  const browser = await chromium.connectOverCDP(
    `http://localhost:${DEVTOOLS_PORT}`
  )
  const page = browser
    .contexts()[0]
    .pages()
    .find(p => p.url().startsWith(url))
  if (!page)
    throw new Error(
      'tab not found: ' +
        browser
          .contexts()[0]
          .pages()
          .map(p => p.url())
    )
  await page.waitForFunction(() => {
    const e = document.querySelector('[data-slate-editor]')
    return e && Object.keys(e).some(k => k.startsWith('__reactFiber$'))
  })
  await sleep(1000)
  const probe = async label =>
    console.log(
      label,
      /mInputShown=true/.test(adb('shell', 'dumpsys', 'input_method')),
      JSON.stringify(
        await page.evaluate(() => {
          const el = document.querySelector('[data-slate-editor]')
          let f = el[Object.keys(el).find(k => k.startsWith('__reactFiber$'))]
          while (f && !f.memoizedProps?.editor) f = f.return
          return [
            f.memoizedProps.editor.selection,
            document.activeElement.tagName,
            scrollY,
          ]
        })
      )
    )
  await probe('loaded')
  await tapLocator(page, page.locator('[data-slate-editor] > *').last(), adb)
  await sleep(1500)
  await probe('tapped editor')
  await tapLocator(
    page,
    page.getByRole('button', { name: 'format_bold', exact: true }),
    adb
  )
  await sleep(800)
  await probe('tapped bold')
  for (const key of ['b', 'o', 'l', 'd']) {
    tapKey(adb, key)
    await sleep(500)
  }
  await sleep(1500)
  const shown = /mInputShown=true/.test(adb('shell', 'dumpsys', 'input_method'))
  const state = await page.evaluate(() => {
    const el = document.querySelector('[data-slate-editor]')
    let f = el[Object.keys(el).find(k => k.startsWith('__reactFiber$'))]
    while (f && !f.memoizedProps?.editor) f = f.return
    const ed = f.memoizedProps.editor
    return {
      last: ed.children[ed.children.length - 1].children,
      sel: ed.selection,
    }
  })
  console.log(JSON.stringify({ port: PORT, keyboardShown: shown, ...state }))
  await browser.close()
})().catch(e => {
  console.error(e.message)
  process.exit(1)
})
