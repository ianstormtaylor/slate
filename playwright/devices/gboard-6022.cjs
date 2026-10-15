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
  const probe = async label => {
    const state = await page.evaluate(() => {
      const el = document.querySelector('[data-slate-editor]')
      let f = el[Object.keys(el).find(k => k.startsWith('__reactFiber$'))]
      while (f && !f.memoizedProps?.editor) f = f.return
      const ed = f.memoizedProps.editor
      return {
        children: ed.children,
        selection: ed.selection,
        activeElement: document.activeElement.tagName,
        scrollY,
      }
    })
    state.keyboardShown = /mInputShown=true/.test(
      adb('shell', 'dumpsys', 'input_method')
    )
    console.log(label, JSON.stringify(state))
    return state
  }
  await probe('loaded')
  await tapLocator(page, page.locator('[data-slate-editor] > *').last(), adb)
  await sleep(1500)
  const before = await probe('tapped editor')
  assert.equal(before.keyboardShown, true, 'editor tap must show the keyboard')
  assert.ok(before.selection, 'editor tap must select text')
  const { anchor, focus } = before.selection
  const lastIndex = before.children.length - 1
  assert.deepEqual(anchor, focus, 'editor tap must place a caret')
  assert.deepEqual(
    focus.path,
    [lastIndex, 0],
    'caret must be in the last paragraph'
  )
  const last = before.children[lastIndex]
  assert.equal(
    last.children.length,
    1,
    'last paragraph must start as one text leaf'
  )
  const original = last.children[0]
  assert.equal(
    original.bold,
    undefined,
    'last paragraph must start without bold'
  )
  await tapLocator(
    page,
    page.getByRole('button', { name: 'format_bold', exact: true }),
    adb
  )
  await sleep(800)
  const toggled = await probe('tapped bold')
  assert.equal(
    toggled.keyboardShown,
    true,
    'bold tap must keep the keyboard visible'
  )
  assert.deepEqual(
    toggled.children,
    before.children,
    'bold tap must preserve the text'
  )
  assert.deepEqual(
    toggled.selection,
    before.selection,
    'bold tap must preserve the caret'
  )
  for (const key of ['b', 'o', 'l', 'd']) {
    tapKey(adb, key)
    await sleep(500)
  }
  await sleep(1500)
  const typed = await probe('after typing')
  const expected = structuredClone(before.children)
  expected[lastIndex].children = [
    { ...original, text: original.text.slice(0, focus.offset) },
    { ...original, text: 'bold', bold: true },
    { ...original, text: original.text.slice(focus.offset) },
  ].filter(leaf => leaf.text.length > 0)
  assert.deepEqual(
    typed.children,
    expected,
    'typing must insert bold text at the original caret'
  )
  assert.equal(
    typed.keyboardShown,
    true,
    'typing must keep the keyboard visible'
  )
  await browser.close()
})().catch(e => {
  console.error(e.message)
  process.exit(1)
})
