const { execFileSync } = require('child_process')
const path = require('path')
const { chromium } = require('@playwright/test')
const {
  consistencyProblems,
  installRecorder,
  placeCaret,
  readState,
  waitForEditor,
  withEditor,
} = require('../runner.cjs')
const scenarios = require('../scenarios/android.cjs')

const SDK =
  process.env.ANDROID_HOME || path.join(process.env.HOME, 'Library/Android/sdk')
const ADB = process.env.ADB || path.join(SDK, 'platform-tools', 'adb')
const PORT = Number(process.env.SLATE_PORT || 3000)
const DEVTOOLS_PORT = Number(process.env.DEVTOOLS_PORT || 9333)
const TEST_IME = 'org.slatejs.testime/.TestIme'
const GBOARD =
  'com.google.android.inputmethod.latin/com.android.inputmethod.latin.LatinIME'
const APK = path.join(__dirname, 'ime', '.build', 'slate-test-ime.apk')

const args = process.argv.slice(2)
const option = name => {
  const index = args.indexOf(`--${name}`)
  return index === -1 ? null : args.splice(index, 2)[1]
}
const serial = option('serial') || process.env.ANDROID_SERIAL
const only = args

const adb = (...adbArgs) =>
  execFileSync(ADB, [...(serial ? ['-s', serial] : []), ...adbArgs], {
    encoding: 'utf8',
  }).trim()

const keyCodes = {
  enter: 66,
  delete: 67,
  forwardDelete: 112,
  left: 21,
  right: 22,
}

const imeCommand = (op, { text, a, b } = {}) => {
  const commandArgs = [
    'shell',
    'am',
    'broadcast',
    '-a',
    'org.slatejs.testime.COMMAND',
    '--es',
    'op',
    op,
  ]
  if (text != null) {
    commandArgs.push(
      '--es',
      'b64',
      Buffer.from(text, 'utf8').toString('base64')
    )
  }
  if (a != null) commandArgs.push('--ei', 'a', String(a))
  if (b != null) commandArgs.push('--ei', 'b', String(b))
  const output = adb(...commandArgs)
  const result = /data="([^"]*)"/.exec(output)?.[1]
  if (!result || result.startsWith('error')) {
    throw new Error(`test keyboard ${op} failed: ${result || output}`)
  }
  return result
}

const setUp = () => {
  if (
    !adb('shell', 'pm', 'list', 'packages', 'org.slatejs.testime').includes(
      'testime'
    )
  ) {
    execFileSync(path.join(__dirname, 'ime', 'build.sh'), { stdio: 'ignore' })
    adb('install', '-r', APK)
  }
  adb('shell', 'ime', 'enable', TEST_IME)
  adb('shell', 'ime', 'set', TEST_IME)
  adb('reverse', `tcp:${PORT}`, `tcp:${PORT}`)
  adb('shell', 'am', 'set-debug-app', '--persistent', 'com.android.chrome')
  adb(
    'shell',
    'echo "_ --disable-fre --no-default-browser-check --no-first-run" > /data/local/tmp/chrome-command-line'
  )
  if (
    !adb('shell', 'cat', '/proc/net/unix').includes('chrome_devtools_remote')
  ) {
    adb(
      'shell',
      'am',
      'start',
      '-a',
      'android.intent.action.VIEW',
      '-d',
      `http://localhost:${PORT}/`,
      'com.android.chrome'
    )
    for (let attempt = 0; attempt < 30; attempt++) {
      if (
        adb('shell', 'cat', '/proc/net/unix').includes('chrome_devtools_remote')
      )
        break
      execFileSync('sleep', ['1'])
    }
  }
  adb('forward', `tcp:${DEVTOOLS_PORT}`, 'localabstract:chrome_devtools_remote')
}

const recordedPages = new WeakSet()

const openExample = async (browser, example, localImages) => {
  const url = `http://localhost:${PORT}/examples/${example}`
  let page = browser.contexts()[0]?.pages()[0]
  if (!page) {
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
    await new Promise(resolve => setTimeout(resolve, 3000))
    page = browser.contexts()[0].pages()[0]
  }
  if (!recordedPages.has(page)) {
    recordedPages.add(page)
    await installRecorder(page)
  }
  if (localImages) {
    await page.route('https://source.unsplash.com/**', route =>
      route.fulfill({
        contentType: 'image/svg+xml',
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="320" height="180" fill="teal"/></svg>',
      })
    )
  }
  await page.bringToFront()
  await page.goto(url)
  await page.locator('[data-slate-editor]').waitFor()
  await waitForEditor(page)
  return page
}

let screenOffset = null

const tapEditor = async page => {
  const target = await page.evaluate(() => {
    const element = document.querySelector('[data-slate-editor]')
    const rect = element.getBoundingClientRect()
    window.__lastTouch = null
    document.addEventListener(
      'touchstart',
      event => {
        window.__lastTouch = event.touches[0].clientY
      },
      { once: true, capture: true }
    )
    return {
      x: rect.left + 16,
      y: rect.top + 12,
      dpr: devicePixelRatio,
      inner: innerHeight,
      screen: screen.height,
    }
  })
  const guess = screenOffset ?? (target.screen - target.inner) * 0.6
  adb(
    'shell',
    'input',
    'tap',
    String(Math.round(target.x * target.dpr)),
    String(Math.round((target.y + guess) * target.dpr))
  )
  await page.waitForTimeout(400)
  const touched = await page.evaluate(() => window.__lastTouch)
  if (touched != null && screenOffset == null) {
    screenOffset = guess + target.y - touched
    return tapEditor(page)
  }
}

const runScenario = async (browser, scenario) => {
  const page = await openExample(
    browser,
    scenario.example,
    scenario.localImages
  )
  const errors = []
  const onError = error => errors.push(error.message)
  const onConsole = message => {
    if (message.type() === 'error' && !message.text().startsWith('Warning:'))
      errors.push(message.text())
  }
  page.on('pageerror', onError)
  page.on('console', onConsole)
  const settle = () => page.waitForTimeout(250)
  const ctx = {
    page,
    tap: async locator => {
      await locator.scrollIntoViewIfNeeded()
      const rect = await locator.boundingBox()
      if (!rect) throw new Error('tap target has no rectangle')
      await locator.evaluate(element => {
        window.__slateDeviceTap = null
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
      const session = await page.context().newCDPSession(page)
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [
          { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 },
        ],
      })
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchEnd',
        touchPoints: [],
      })
      await session.detach()
      const touch = await page.evaluate(() => window.__slateDeviceTap)
      if (!touch?.trusted || touch.type !== 'touch')
        throw new Error('touch did not reach the expected target')
      await settle()
    },
    hideKeyboard: async () => {
      adb('shell', 'input', 'keyevent', '4')
      await page.waitForTimeout(800)
    },
    keyboardShown: () => {
      const state = adb('shell', 'dumpsys', 'input_method')
      const match = /mInputShown=(true|false)/.exec(state)
      if (!match) throw new Error('keyboard visibility missing from dumpsys')
      return match[1] === 'true'
    },
    composeSequence: async values => {
      for (const text of values) imeCommand('compose', { text })
      await settle()
    },
    compose: async text => (imeCommand('compose', { text }), settle()),
    commit: async text => (imeCommand('commit', { text }), settle()),
    finish: async () => (imeCommand('finish'), settle()),
    deleteAround: async (before, after = 0) => (
      imeCommand('delete', { a: before, b: after }), settle()
    ),
    region: async (start, end) => (
      imeCommand('region', { a: start, b: end }), settle()
    ),
    setSelection: async (start, end = start) => (
      imeCommand('select', { a: start, b: end }), settle()
    ),
    key: async (name, count = 1) => {
      for (let index = 0; index < count; index++) {
        imeCommand('key', { a: keyCodes[name] ?? name })
        await settle()
      }
    },
    imeState: () => imeCommand('state'),
    typeWord: async word => {
      for (let length = 1; length <= word.length; length++) {
        imeCommand('compose', { text: word.slice(0, length) })
        await page.waitForTimeout(60)
      }
      await settle()
    },
    caret: where => placeCaret(page, where),
    editor: (fn, value) => withEditor(page, fn, value),
    wait: ms => page.waitForTimeout(ms),
    state: () => readState(page),
  }
  let problems = []
  try {
    await tapEditor(page)
    imeCommand('state')
    problems = (await scenario.run(ctx)) || []
    await page.waitForTimeout(400)
  } catch (error) {
    problems.push(`step failed: ${error.message.split('\n')[0]}`)
  }
  let state
  try {
    state = await readState(page)
  } catch (error) {
    problems.push(
      `editor unreadable at ${page.url()}: ${error.message.split('\n')[0]}`
    )
    state = { model: [], events: [] }
  }
  if (state.dom && !scenario.allowInconsistentDom)
    problems.push(...consistencyProblems(state))
  problems.push(...errors.map(error => `page error: ${error}`))
  page.off('pageerror', onError)
  page.off('console', onConsole)
  return { problems, state }
}

;(async () => {
  setUp()
  const browser = await chromium.connectOverCDP(
    `http://localhost:${DEVTOOLS_PORT}`
  )
  const selected = scenarios.filter(
    scenario =>
      only.length === 0 ||
      only.includes(scenario.name) ||
      scenario.issues.some(issue => only.includes(String(issue)))
  )
  const results = []
  for (const scenario of selected) {
    const { problems, state } = await runScenario(browser, scenario)
    const passed = problems.length === 0
    results.push({ scenario: scenario.name, passed, problems })
    process.stdout.write(
      `${passed ? 'PASS' : 'FAIL'} android ${scenario.name} (${scenario.issues
        .map(issue => `#${issue}`)
        .join(' ')})\n`
    )
    for (const problem of problems) process.stdout.write(`  ${problem}\n`)
    if (!passed || process.env.VERBOSE) {
      process.stdout.write(`  model ${JSON.stringify(state.model)}\n`)
      process.stdout.write(`  events ${state.events.slice(-30).join(' ')}\n`)
    }
  }
  await browser.close()
  if (process.env.KEEP_TEST_IME !== '1') adb('shell', 'ime', 'set', GBOARD)
  if (process.env.RESULTS) {
    require('fs').writeFileSync(
      process.env.RESULTS,
      JSON.stringify(results, null, 2)
    )
  }
  process.exit(results.every(result => result.passed) ? 0 : 1)
})().catch(error => {
  process.stderr.write(`${error.stack}\n`)
  process.exit(1)
})
