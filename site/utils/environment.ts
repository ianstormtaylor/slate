export const IS_MAC =
  typeof navigator !== 'undefined' && /Mac OS X/.test(navigator.userAgent)

export const IS_ANDROID =
  typeof navigator !== 'undefined' && /Android/.test(navigator.userAgent)
