
import browser from 'detect-browser'
import Parser from 'ua-parser-js'

/**
 * Read the environment.
 *
 * @return {Object} environment
 */

function environment() {
  return {
    IS_ANDROID: browser.name === 'android',
    IS_CHROME: browser.name === 'chrome',
    IS_EDGE: browser.name === 'edge',
    IS_FIREFOX: browser.name === 'firefox',
    IS_IE: browser.name === 'ie',
    IS_IOS: browser.name === 'ios',
    IS_MAC: new Parser().getOS().name === 'Mac OS',
    IS_UBUNTU: new Parser().getOS().name === 'Ubuntu',
    IS_SAFARI: browser.name === 'safari',
    IS_WINDOWS: new Parser().getOS().name.includes('Windows')
  }
}

/**
 * Export.
 */

export default environment
