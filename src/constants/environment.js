
import Parser from 'ua-parser-js'
import browser from 'detect-browser'
import includes from 'lodash/includes'

/**
 * Export.
 *
 * @type {Object}
 */

export const IS_ANDROID = process.browser && browser.name == 'android'
export const IS_CHROME = process.browser && browser.name == 'chrome'
export const IS_EDGE = process.browser && browser.name == 'edge'
export const IS_FIREFOX = process.browser && browser.name == 'firefox'
export const IS_IE = process.browser && browser.name == 'ie'
export const IS_IOS = process.browser && browser.name == 'ios'
export const IS_MAC = process.browser && new Parser().getOS().name == 'Mac OS'
export const IS_SAFARI = process.browser && browser.name == 'safari'
export const IS_UBUNTU = process.browser && new Parser().getOS().name == 'Ubuntu'
export const IS_WINDOWS = process.browser && includes(new Parser().getOS().name, 'Windows')

export default {
  IS_ANDROID,
  IS_CHROME,
  IS_EDGE,
  IS_FIREFOX,
  IS_IE,
  IS_IOS,
  IS_MAC,
  IS_SAFARI,
  IS_UBUNTU,
  IS_WINDOWS
}
