import { IS_ANDROID } from 'slate-dev-environment'

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

function getApiVersion() {
  if (!IS_ANDROID) return null
  const { userAgent } = window.navigator
  const matchData = userAgent.match(/Android\s([0-9\.]+)/)
  if (matchData == null) return null
  const versionString = matchData[1]
  for (let tuple of ANDROID_API_VERSIONS) {
    const [regex, version] = tuple
    if (versionString.match(regex)) return version //tags.push(tag)
  }
  return null
}

const API_VERSION = getApiVersion()

export default API_VERSION
