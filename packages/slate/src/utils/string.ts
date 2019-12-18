/**
 * Constants for string distance checking.
 */

const SPACE = /\s/
const PUNCTUATION = /[\u0021-\u0023\u0025-\u002A\u002C-\u002F\u003A\u003B\u003F\u0040\u005B-\u005D\u005F\u007B\u007D\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E3B\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/
const CHAMELEON = /['\u2018\u2019]/
const SURROGATE_START = 0xd800
const SURROGATE_END = 0xdfff
const ZERO_WIDTH_JOINER = 0x200d

/**
 * Get the distance to the end of the first character in a string of text.
 */

export const getCharacterDistance = (text: string): number => {
  let offset = 0
  // prev types:
  // SURR: surrogate pair
  // MOD: modifier (technically also surrogate pair)
  // ZWJ: zero width joiner
  // VAR: variation selector
  // BMP: sequenceable character from basic multilingual plane
  let prev: 'SURR' | 'MOD' | 'ZWJ' | 'VAR' | 'BMP' | null = null
  let charCode = text.charCodeAt(0)

  while (charCode) {
    if (isSurrogate(charCode)) {
      const modifier = isModifier(charCode, text, offset)

      // Early returns are the heart of this function, where we decide if previous and current
      // codepoints should form a single character (in terms of how many of them should selection
      // jump over).
      if (prev === 'SURR' || prev === 'BMP') {
        break
      }

      offset += 2
      prev = modifier ? 'MOD' : 'SURR'
      charCode = text.charCodeAt(offset)
      // Absolutely fine to `continue` without any checks because if `charCode` is NaN (which
      // is the case when out of `text` range), next `while` loop won"t execute and we"re done.
      continue
    }

    if (charCode === ZERO_WIDTH_JOINER) {
      offset += 1
      prev = 'ZWJ'
      charCode = text.charCodeAt(offset)

      continue
    }

    if (isBMPEmoji(charCode)) {
      if (prev && prev !== 'ZWJ' && prev !== 'VAR') {
        break
      }
      offset += 1
      prev = 'BMP'
      charCode = text.charCodeAt(offset)

      continue
    }

    if (isVariationSelector(charCode)) {
      if (prev && prev !== 'ZWJ') {
        break
      }
      offset += 1
      prev = 'VAR'
      charCode = text.charCodeAt(offset)
      continue
    }

    // Modifier 'groups up' with what ever character is before that (even whitespace), need to
    // look ahead.
    if (prev === 'MOD') {
      offset += 1
      break
    }

    // If while loop ever gets here, we're done (e.g latin chars).
    break
  }

  return offset || 1
}

/**
 * Get the distance to the end of the first word in a string of text.
 */

export const getWordDistance = (text: string): number => {
  let length = 0
  let i = 0
  let started = false
  let char

  while ((char = text.charAt(i))) {
    const l = getCharacterDistance(char)
    char = text.slice(i, i + l)
    const rest = text.slice(i + l)

    if (isWordCharacter(char, rest)) {
      started = true
      length += l
    } else if (!started) {
      length += l
    } else {
      break
    }

    i += l
  }

  return length
}

/**
 * Check if a character is a word character. The `remaining` argument is used
 * because sometimes you must read subsequent characters to truly determine it.
 */

const isWordCharacter = (char: string, remaining: string): boolean => {
  if (SPACE.test(char)) {
    return false
  }

  // Chameleons count as word characters as long as they're in a word, so
  // recurse to see if the next one is a word character or not.
  if (CHAMELEON.test(char)) {
    let next = remaining.charAt(0)
    const length = getCharacterDistance(next)
    next = remaining.slice(0, length)
    const rest = remaining.slice(length)

    if (isWordCharacter(next, rest)) {
      return true
    }
  }

  if (PUNCTUATION.test(char)) {
    return false
  }

  return true
}

/**
 * Determines if `code` is a surrogate
 */

const isSurrogate = (code: number): boolean =>
  SURROGATE_START <= code && code <= SURROGATE_END

/**
 * Does `code` form Modifier with next one.
 *
 * https://emojipedia.org/modifiers/
 */

const isModifier = (code: number, text: string, offset: number): boolean => {
  if (code === 0xd83c) {
    const next = text.charCodeAt(offset + 1)
    return next <= 0xdfff && next >= 0xdffb
  }
  return false
}

/**
 * Is `code` a Variation Selector.
 *
 * https://codepoints.net/variation_selectors
 */

const isVariationSelector = (code: number): boolean => {
  return code <= 0xfe0f && code >= 0xfe00
}

/**
 * Is `code` one of the BMP codes used in emoji sequences.
 *
 * https://emojipedia.org/emoji-zwj-sequences/
 */

const isBMPEmoji = (code: number): boolean => {
  // This requires tiny bit of maintanance, better ideas?
  // Fortunately it only happens if new Unicode Standard
  // is released. Fails gracefully if upkeep lags behind,
  // same way Slate previously behaved with all emojis.
  return (
    code === 0x2764 || // heart (❤)
    code === 0x2642 || // male (♂)
    code === 0x2640 || // female (♀)
    code === 0x2620 || // scull (☠)
    code === 0x2695 || // medical (⚕)
    code === 0x2708 || // plane (✈️)
    code === 0x25ef // large circle (◯)
  )
}
