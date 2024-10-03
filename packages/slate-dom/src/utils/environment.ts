export const IS_IOS =
  typeof navigator !== 'undefined' &&
  typeof window !== 'undefined' &&
  /iPad|iPhone|iPod/.test(navigator.userAgent) &&
  !window.MSStream

export const IS_APPLE =
  typeof navigator !== 'undefined' && /Mac OS X/.test(navigator.userAgent)

export const IS_ANDROID =
  typeof navigator !== 'undefined' && /Android/.test(navigator.userAgent)

export const IS_FIREFOX =
  typeof navigator !== 'undefined' &&
  /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent)

export const IS_WEBKIT =
  typeof navigator !== 'undefined' &&
  /AppleWebKit(?!.*Chrome)/i.test(navigator.userAgent)

// "modern" Edge was released at 79.x
export const IS_EDGE_LEGACY =
  typeof navigator !== 'undefined' &&
  /Edge?\/(?:[0-6][0-9]|[0-7][0-8])(?:\.)/i.test(navigator.userAgent)

export const IS_CHROME =
  typeof navigator !== 'undefined' && /Chrome/i.test(navigator.userAgent)

// Native `beforeInput` events don't work well with react on Chrome 75
// and older, Chrome 76+ can use `beforeInput` though.
export const IS_CHROME_LEGACY =
  typeof navigator !== 'undefined' &&
  /Chrome?\/(?:[0-7][0-5]|[0-6][0-9])(?:\.)/i.test(navigator.userAgent)

export const IS_ANDROID_CHROME_LEGACY =
  IS_ANDROID &&
  typeof navigator !== 'undefined' &&
  /Chrome?\/(?:[0-5]?\d)(?:\.)/i.test(navigator.userAgent)

// Firefox did not support `beforeInput` until `v87`.
export const IS_FIREFOX_LEGACY =
  typeof navigator !== 'undefined' &&
  /^(?!.*Seamonkey)(?=.*Firefox\/(?:[0-7][0-9]|[0-8][0-6])(?:\.)).*/i.test(
    navigator.userAgent
  )

// UC mobile browser
export const IS_UC_MOBILE =
  typeof navigator !== 'undefined' && /.*UCBrowser/.test(navigator.userAgent)

// Wechat browser (not including mac wechat)
export const IS_WECHATBROWSER =
  typeof navigator !== 'undefined' &&
  /.*Wechat/.test(navigator.userAgent) &&
  !/.*MacWechat/.test(navigator.userAgent) // avoid lookbehind (buggy in safari < 16.4)

// Check if DOM is available as React does internally.
// https://github.com/facebook/react/blob/master/packages/shared/ExecutionEnvironment.js
export const CAN_USE_DOM = !!(
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'
)

// Check if the browser is Safari and older than 17
export const IS_SAFARI_LEGACY =
  typeof navigator !== 'undefined' &&
  /Safari/.test(navigator.userAgent) &&
  /Version\/(\d+)/.test(navigator.userAgent) &&
  (navigator.userAgent.match(/Version\/(\d+)/)?.[1]
    ? parseInt(navigator.userAgent.match(/Version\/(\d+)/)?.[1]!, 10) < 17
    : false)

// COMPAT: Firefox/Edge Legacy don't support the `beforeinput` event
// Chrome Legacy doesn't support `beforeinput` correctly
export const HAS_BEFORE_INPUT_SUPPORT =
  (!IS_CHROME_LEGACY || !IS_ANDROID_CHROME_LEGACY) &&
  !IS_EDGE_LEGACY &&
  // globalThis is undefined in older browsers
  typeof globalThis !== 'undefined' &&
  globalThis.InputEvent &&
  // @ts-ignore The `getTargetRanges` property isn't recognized.
  typeof globalThis.InputEvent.prototype.getTargetRanges === 'function'
