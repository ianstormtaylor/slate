
import browser from 'is-in-browser'

/**
 * Browser matching rules.
 *
 * @type {Array}
 */

const BROWSER_RULES = [
  ['edge', /Edge\/([0-9\._]+)/],
  ['chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
  ['firefox', /Firefox\/([0-9\.]+)(?:\s|$)/],
  ['opera', /Opera\/([0-9\.]+)(?:\s|$)/],
  ['opera', /OPR\/([0-9\.]+)(:?\s|$)$/],
  ['ie', /Trident\/7\.0.*rv\:([0-9\.]+)\).*Gecko$/],
  ['ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
  ['ie', /MSIE\s(7\.0)/],
  ['android', /Android\s([0-9\.]+)/],
  ['safari', /Version\/([0-9\._]+).*Safari/],
]

/**
 * DOM event matching rules.
 *
 * @type {Array}
 */

const EVENT_RULES = [
  ['beforeinput', el => 'onbeforeinput' in el]
]

/**
 * Operating system matching rules.
 *
 * @type {Array}
 */

const OS_RULES = [
  ['ios', /os ([\.\_\d]+) like mac os/i], // must be before the macos rule
  ['macos', /mac os x/i],
  ['android', /android/i],
  ['firefoxos', /mozilla\/[a-z\.\_\d]+ \((?:mobile)|(?:tablet)/i],
  ['windows', /windows\s*(?:nt)?\s*([\.\_\d]+)/i],
]

/**
 * Define variables to store the result.
 */

let BROWSER
const EVENTS = {}
let OS

/**
 * Run the matchers when in browser.
 */

if (browser) {
  const { userAgent } = window.navigator

  for (const [ name, regexp ] of BROWSER_RULES) {
    if (regexp.test(userAgent)) {
      BROWSER = name
      break
    }
  }

  for (const [ name, regexp ] of OS_RULES) {
    if (regexp.test(userAgent)) {
      OS = name
      break
    }
  }

  const testEl = window.document.createElement('div')
  testEl.contentEditable = true

  for (const [ name, testFn ] of EVENT_RULES) {
    EVENTS[name] = testFn(testEl)
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

export const IS_CHROME = BROWSER === 'chrome'
export const IS_FIREFOX = BROWSER === 'firefox'
export const IS_SAFARI = BROWSER === 'safari'
export const IS_IE = BROWSER === 'ie'

export const IS_ANDROID = OS === 'android'
export const IS_IOS = OS === 'ios'
export const IS_MAC = OS === 'macos'
export const IS_WINDOWS = OS === 'windows'

export const SUPPORTED_EVENTS = EVENTS
