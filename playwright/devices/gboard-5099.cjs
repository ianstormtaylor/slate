const assert = require('node:assert/strict')
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
  const state = async () => ({
    ...(await page.evaluate(() => {
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
    })),
    keyboardShown: /mInputShown=true/.test(
      adb('shell', 'dumpsys', 'input_method')
    ),
  })
  const expectEmpty = async label => {
    const current = await state()
    console.log(label, JSON.stringify(current))
    assert.deepEqual(current.text, [''], `${label}: editor must be empty`)
    assert.equal(
      current.keyboardShown,
      true,
      `${label}: keyboard must stay visible`
    )
    assert.notEqual(
      current.placeholder,
      'none',
      `${label}: placeholder must be visible`
    )
  }
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
  await expectEmpty('cleared')
  for (let i = 0; i < 3; i++) {
    tapKey(adb, 'Delete')
    await sleep(400)
  }
  await expectEmpty('after backspace')
  for (const k of ['a', 's', 'd']) {
    tapKey(adb, k)
    await sleep(400)
  }
  await sleep(1200)
  const typed = await state()
  console.log('after typing', JSON.stringify(typed))
  assert.equal(typed.text.length, 1, 'typing must keep one block')
  assert.match(typed.text[0], /^[aA]sd$/, 'all three keys must reach the model')
  assert.equal(typed.dom, typed.text[0], 'DOM and model must agree')
  assert.equal(
    typed.keyboardShown,
    true,
    'typing must keep the keyboard visible'
  )
  assert.equal(typed.placeholder, 'none', 'typing must hide the placeholder')
  await browser.close()
})().catch(e => {
  console.error(e.message)
  process.exit(1)
})
