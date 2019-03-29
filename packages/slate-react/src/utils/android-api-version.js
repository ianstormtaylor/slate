import { IS_ANDROID } from 'slate-dev-environment'

/**
 * Array of regular expression matchers and their API version
 *
 * @type {Array}
 */

const ANDROID_API_VERSIONS = [
  [/^9([.]0|)/, 28],
  [/^8[.]1/, 27],
  [/^8([.]0|)/, 26],
  [/^7[.]1/, 25],
  [/^7([.]0|)/, 24],
  [/^6([.]0|)/, 23],
  [/^5[.]1/, 22],
  [/^5([.]0|)/, 21],
  [/^4[.]4/, 20],
]

/**
 * get the Android API version from the userAgent
 *
 * @return {Number} version
 */

function getApiVersion() {
  if (!IS_ANDROID) return null
  const { userAgent } = window.navigator
  const matchData = userAgent.match(/Android\s([0-9\.]+)/)
  if (matchData == null) return null
  const versionString = matchData[1]

  for (const tuple of ANDROID_API_VERSIONS) {
    const [regex, version] = tuple
    if (versionString.match(regex)) return version
  }
  return null
}

const API_VERSION = getApiVersion()

/**
 * Export.
 *
 * type {number}
 */

export default API_VERSION
