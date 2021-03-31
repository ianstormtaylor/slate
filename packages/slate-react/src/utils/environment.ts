export const IS_IOS =
  typeof navigator !== 'undefined' &&
  typeof window !== 'undefined' &&
  /iPad|iPhone|iPod/.test(navigator.userAgent) &&
  !window.MSStream

export const IS_APPLE =
  typeof navigator !== 'undefined' && /Mac OS X/.test(navigator.userAgent)

export const IS_FIREFOX =
  typeof navigator !== 'undefined' &&
  /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent)

export const IS_SAFARI =
  typeof navigator !== 'undefined' &&
  /Version\/[\d\.]+.*Safari/.test(navigator.userAgent)

// "modern" Edge was released at 79.x
export const IS_EDGE_LEGACY =
  typeof navigator !== 'undefined' &&
  /Edge?\/(?:[0-6][0-9]|[0-7][0-8])/i.test(navigator.userAgent)

export const IS_CHROME =
  typeof navigator !== 'undefined' && /Chrome/i.test(navigator.userAgent)

// Native beforeInput events don't work well with react on Chrome 75 and older, Chrome 76+ can use beforeInput
export const IS_CHROME_LEGACY =
  typeof navigator !== 'undefined' &&
  /Chrome?\/(?:[0-7][0-5]|[0-6][0-9])/i.test(navigator.userAgent)

/**
 * Check if DOM is available as React does internally.
 * @see https://github.com/facebook/react/blob/master/packages/shared/ExecutionEnvironment.js
 */
export const CAN_USE_DOM = !!(
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'
)
