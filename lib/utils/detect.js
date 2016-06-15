
import browser from 'detect-browser'
import Parser from 'ua-parser-js'

/**
 * Detections.
 */

export const IS_ANDROID = browser.name === 'android'
export const IS_CHROME = browser.name === 'chrome'
export const IS_EDGE = browser.name === 'edge'
export const IS_FIREFOX = browser.name === 'firefox'
export const IS_IE = browser.name === 'ie'
export const IS_IOS = browser.name === 'ios'
export const IS_MAC = new Parser().getOS().name === 'Mac OS'
export const IS_UBUNTU = new Parser().getOS().name === 'Ubuntu'
export const IS_SAFARI = browser.name === 'safari'
export const IS_WINDOWS = new Parser().getOS().name.includes('Windows')
