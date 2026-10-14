const { execFileSync } = require('child_process')
const path = require('path')
const playwright = require('@playwright/test')
const {
  consistencyProblems,
  installRecorder,
  placeCaret,
  readState,
  waitForEditor,
  screenPoint,
  withEditor,
} = require('../runner.cjs')
const scenarios = require('../scenarios/macos.cjs')

const BASE_URL = process.env.SLATE_URL || 'http://localhost:3000'
const IME_KEY = process.env.IME_KEY || path.join(__dirname, '.build', 'ime-key')

const inputSources = {
  us: 'com.apple.keylayout.US',
  pinyin: 'com.apple.inputmethod.SCIM.ITABC',
  japanese: 'com.apple.inputmethod.Kotoeri.RomajiTyping.Japanese',
  korean: 'com.apple.inputmethod.Korean.2SetKorean',
  russian: 'com.apple.keylayout.Russian',
}

const args = process.argv.slice(2)
const option = name => {
  const index = args.indexOf(`--${name}`)
  return index === -1 ? null : args.splice(index, 2)[1]
}
const browserNames = (option('browsers') || 'chromium,firefox,webkit').split(
  ','
)
const only = args

const buildHelper = () => {
  if (process.env.IME_KEY) return
  execFileSync('mkdir', ['-p', path.dirname(IME_KEY)])
  execFileSync('swiftc', [
    '-O',
    path.join(__dirname, 'ime-key.swift'),
    '-o',
    IME_KEY,
  ])
}

const outsideScript = () => {
  document.addEventListener('DOMContentLoaded', () => {
    const outside = document.createElement('textarea')
    outside.id = 'device-outside'
    outside.style.cssText =
      'position:fixed;right:8px;bottom:8px;width:120px;height:40px;z-index:9999'
    document.body.appendChild(outside)
  })
}

const descendantPids = root => {
  const rows = execFileSync('ps', ['-A', '-o', 'pid=,ppid='], {
    encoding: 'utf8',
  })
    .trim()
    .split('\n')
    .map(row => row.trim().split(/\s+/).map(Number))
  const found = [root]
  for (let index = 0; index < found.length; index++) {
    for (const [pid, ppid] of rows) if (ppid === found[index]) found.push(pid)
  }
  return found
}

const findAppPid = root => {
  for (const pid of descendantPids(root)) {
    try {
      execFileSync(IME_KEY, ['--pid', String(pid), 'activate'], {
        stdio: 'ignore',
      })
      return pid
    } catch (error) {}
  }
  throw new Error(`no app window found under pid ${root}`)
}

const appPids = new Map()
const composingSources = new Set(['pinyin', 'japanese', 'korean'])

class HarnessError extends Error {}

const recentEvents = page =>
  page.evaluate(() => window.__slateDeviceEvents.length)

const runScenario = async (browser, rootPid, scenario, browserName) => {
  const context = await browser.newContext({ viewport: null })
  const page = await context.newPage()
  if (!appPids.has(rootPid)) appPids.set(rootPid, findAppPid(rootPid))
  const pid = appPids.get(rootPid)
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => {
    if (message.type() === 'error' && !message.text().startsWith('Warning:')) {
      errors.push(message.text())
    }
  })
  await installRecorder(page)
  await page.addInitScript(outsideScript)
  await page.goto(`${BASE_URL}/examples/${scenario.example}`)
  await page.locator('[data-slate-editor]').waitFor()
  await waitForEditor(page)

  const helper = (...helperArgs) =>
    execFileSync(IME_KEY, ['--pid', String(pid), ...helperArgs], {
      encoding: 'utf8',
    }).trim()
  const original = execFileSync(IME_KEY, ['current'], {
    encoding: 'utf8',
  }).trim()
  const clickAt = async (selector, position) => {
    const point = await screenPoint(page, selector, position)
    helper('click', String(point.x), String(point.y))
    await page.waitForTimeout(150)
  }

  let activeSource = 'us'
  const typeText = async text => {
    if (!composingSources.has(activeSource)) return helper('type', text)
    const before = await recentEvents(page)
    const outsideBefore = await page.locator('#device-outside').inputValue()
    helper('type', text)
    await page.waitForTimeout(100)
    const composed = await page.evaluate(
      start =>
        window.__slateDeviceEvents
          .slice(start)
          .some(event => event.startsWith('composition')),
      before
    )
    const outsideAfter = await page.locator('#device-outside').inputValue()
    const outsideComposed =
      outsideAfter !== outsideBefore && !outsideAfter.endsWith(text)
    if (!composed && !outsideComposed) {
      throw new HarnessError(`${activeSource} IME did not engage for "${text}"`)
    }
  }

  const ctx = {
    browserName,
    page,
    ime: name => {
      activeSource = name
      helper('select', inputSources[name] || name)
    },
    type: typeText,
    key: (chord, count = 1) => helper('key', chord, String(count)),
    clickEditor: () => clickAt('[data-slate-editor]'),
    click: (selector, position = 'center') => clickAt(selector, position),
    clickOutside: () => clickAt('#device-outside', 'center'),
    caret: where => placeCaret(page, where),
    editor: (fn, value) => withEditor(page, fn, value),
    wait: ms => page.waitForTimeout(ms),
    state: () => readState(page),
    outsideValue: () => page.locator('#device-outside').inputValue(),
  }

  let problems = []
  try {
    helper('activate')
    await ctx.clickEditor()
    problems = (await scenario.run(ctx)) || []
    await page.waitForTimeout(300)
  } catch (error) {
    if (error instanceof HarnessError) {
      execFileSync(IME_KEY, ['select', original])
      await context.close()
      return { inconclusive: error.message }
    }
    problems.push(`step failed: ${error.message.split('\n')[0]}`)
  } finally {
    execFileSync(IME_KEY, ['select', original])
  }

  const state = await readState(page)
  if (!scenario.allowInconsistentDom) {
    problems.push(...consistencyProblems(state))
  }
  problems.push(...errors.map(error => `page error: ${error}`))
  await context.close()
  return { problems, state }
}

;(async () => {
  buildHelper()
  if (
    execFileSync(IME_KEY, ['trusted'], { encoding: 'utf8' }).trim() !== 'true'
  ) {
    throw new Error(
      'Grant Accessibility to your terminal in System Settings > Privacy & Security'
    )
  }
  const selected = scenarios.filter(
    scenario =>
      only.length === 0 ||
      only.includes(scenario.name) ||
      scenario.issues.some(issue => only.includes(String(issue)))
  )
  const results = []
  for (const browserName of browserNames) {
    const server = await playwright[browserName].launchServer({
      headless: false,
    })
    const browser = await playwright[browserName].connect(server.wsEndpoint())
    const pid = server.process().pid
    for (const scenario of selected) {
      if (scenario.browsers && !scenario.browsers.includes(browserName))
        continue
      let outcome
      for (let attempt = 0; attempt < 3; attempt++) {
        outcome = await runScenario(browser, pid, scenario, browserName)
        if (!outcome.inconclusive) break
      }
      if (outcome.inconclusive) {
        results.push({
          scenario: scenario.name,
          browserName,
          inconclusive: outcome.inconclusive,
        })
        process.stdout.write(
          `SKIP ${browserName} ${scenario.name}: ${outcome.inconclusive}\n`
        )
        continue
      }
      const { problems, state } = outcome
      const passed = problems.length === 0
      results.push({ scenario: scenario.name, browserName, passed, problems })
      process.stdout.write(
        `${passed ? 'PASS' : 'FAIL'} ${browserName} ${
          scenario.name
        } (${scenario.issues.map(issue => `#${issue}`).join(' ')})\n`
      )
      for (const problem of problems) process.stdout.write(`  ${problem}\n`)
      if (!passed || process.env.VERBOSE) {
        process.stdout.write(`  model ${JSON.stringify(state.model)}\n`)
        process.stdout.write(`  events ${state.events.slice(-30).join(' ')}\n`)
      }
    }
    await browser.close()
    await server.close()
  }
  if (process.env.RESULTS) {
    require('fs').writeFileSync(
      process.env.RESULTS,
      JSON.stringify(results, null, 2)
    )
  }
  process.exitCode = results.every(
    result => result.passed || result.inconclusive
  )
    ? 0
    : 1
})().catch(error => {
  process.stderr.write(`${error.stack}\n`)
  process.exit(1)
})
