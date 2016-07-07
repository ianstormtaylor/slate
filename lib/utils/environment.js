
import browser from 'detect-browser'
import Parser from 'ua-parser-js'

/**
 * Export.
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
export const IS_WINDOWS = process.browser && new Parser().getOS().name.includes('Windows')
