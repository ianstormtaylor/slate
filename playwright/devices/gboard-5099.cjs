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
  const url = `http://localhost:${PORT}/examples/richtext`
  adb('reverse', `tcp:${PORT}`, `tcp:${PORT}`)
  adb(
    'shell',
    'ime',
    'set',
    'com.google.android.inputmethod.latin/com.android.inputmethod.latin.LatinIME'
  )
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
  const state = () =>
    page.evaluate(() => {
      const el = document.querySelector('[data-slate-editor]')
      let f = el[Object.keys(el).find(k => k.startsWith('__reactFiber$'))]
      while (f && !f.memoizedProps?.editor) f = f.return
      const ed = f.memoizedProps.editor
      const p = document.querySelector('[data-slate-placeholder]')
      return {
        text: ed.children.map(n => n.children.map(c => c.text).join('')),
        dom: el.innerText.slice(0, 40),
        placeholder: p ? getComputedStyle(p).display : 'none',
      }
    })
  await tapLocator(page, page.locator('[data-slate-editor] > *').last(), adb)
  await sleep(1500)
  await page.evaluate(() => {
    const el = document.querySelector('[data-slate-editor]')
    let f = el[Object.keys(el).find(k => k.startsWith('__reactFiber$'))]
    while (f && !f.memoizedProps?.editor) f = f.return
    const ed = f.memoizedProps.editor
    ed.select([])
    ed.deleteFragment()
  })
  await sleep(800)
  console.log('cleared', JSON.stringify(await state()))
  for (let i = 0; i < 3; i++) {
    tapKey(adb, 'Delete')
    await sleep(400)
  }
  console.log(
    'after backspace',
    JSON.stringify(await state()),
    /mInputShown=true/.test(adb('shell', 'dumpsys', 'input_method'))
  )
  for (const k of ['a', 's', 'd']) {
    tapKey(adb, k)
    await sleep(400)
  }
  await sleep(1200)
  console.log('after typing', JSON.stringify(await state()))
  await browser.close()
})().catch(e => {
  console.error(e.message)
  process.exit(1)
})
