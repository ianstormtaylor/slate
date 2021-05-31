/**
 * Constants for string distance checking.
 */

const SPACE = /\s/
const PUNCTUATION = /[\u0021-\u0023\u0025-\u002A\u002C-\u002F\u003A\u003B\u003F\u0040\u005B-\u005D\u005F\u007B\u007D\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E3B\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/
const CHAMELEON = /['\u2018\u2019]/

/**
 * Get the distance to the end of the first character in a string of text.
 */

export const getCharacterDistance = (text: string): number => {
  let offset = 0
  // prev types:
  // NSEQ: non sequenceable codepoint.
  // MOD: modifier
  // ZWJ: zero width joiner
  // VAR: variation selector
  // BMP: sequenceable codepoint from basic multilingual plane
  // RI: regional indicator
  // KC: keycap
  // Tag: tag
  let prev:
    | 'NSEQ'
    | 'MOD'
    | 'ZWJ'
    | 'VAR'
    | 'BMP'
    | 'RI'
    | 'KC'
    | 'TAG'
    | null = null

  while (true) {
    const code = text.codePointAt(offset)
    if (!code) break

    // Check if code point is part of a sequence.
    if (isZWJ(code)) {
      offset += 1
      prev = 'ZWJ'

      continue
    }

    if (isKeycap(code)) {
      if (prev === 'KC') {
        break
      }

      offset += 1
      prev = 'KC'
      continue
    }
    if (isCombiningEnclosingKeycap(code)) {
      offset += 1
      break
    }

    if (isVariationSelector(code)) {
      offset += 1

      if (prev === 'BMP') {
        break
      }

      prev = 'VAR'

      continue
    }

    if (isBMPEmoji(code)) {
      if (prev && prev !== 'ZWJ' && prev !== 'VAR') {
        break
      }

      offset += 1
      prev = 'BMP'

      continue
    }

    if (isModifier(code)) {
      offset += 2
      prev = 'MOD'

      continue
    }

    if (isBlackFlag(code)) {
      if (prev === 'TAG') {
        break
      }
      offset += 2
      prev = 'TAG'
      continue
    }
    if (prev === 'TAG' && isTag(code)) {
      offset += 2

      if (isCancelTag(code)) break

      continue
    }

    if (isRegionalIndicator(code)) {
      offset += 2

      if (prev === 'RI') {
        break
      }

      prev = 'RI'

      continue
    }

    if (!isBMP(code)) {
      // If previous code point is not sequenceable, it means we are not in a
      // sequence.
      if (prev === 'NSEQ') {
        break
      }

      offset += 2
      prev = 'NSEQ'

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
 * Does `code` form Modifier with next one.
 *
 * https://emojipedia.org/modifiers/
 */

const isModifier = (code: number): boolean => {
  return code >= 0x1f3fb && code <= 0x1f3ff
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
 * Is `code` a code point used in keycap sequence.
 *
 * https://emojipedia.org/emoji-keycap-sequence/
 */

const isKeycap = (code: number): boolean => {
  return (
    (code >= 0x30 && code <= 0x39) || // digits
    code === 0x23 || // number sign
    code === 0x2a
  )
}

/**
 * Is `code` a Combining Enclosing Keycap.
 *
 * https://emojipedia.org/combining-enclosing-keycap/
 */

const isCombiningEnclosingKeycap = (code: number): boolean => {
  return code === 0x20e3
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
    code === 0x25ef || // large circle (◯)
    code === 0x2b06 || // up arrow (⬆)
    code === 0x2197 || // up-right arrow (↗)
    code === 0x27a1 || // right arrow (➡)
    code === 0x2198 || // down-right arrow (↘)
    code === 0x2b07 || // down arrow (⬇)
    code === 0x2199 || // down-left arrow (↙)
    code === 0x2b05 || // left arrow (⬅)
    code === 0x2196 || // up-left arrow (↖)
    code === 0x2195 || // up-down arrow (↕)
    code === 0x2194 || // left-right arrow (↔)
    code === 0x21a9 || // right arrow curving left (↩)
    code === 0x21aa || // left arrow curving right (↪)
    code === 0x2934 || // right arrow curving up (⤴)
    code === 0x2935 // right arrow curving down (⤵)
  )
}

/**
 * Is `code` a Regional Indicator.
 *
 * https://en.wikipedia.org/wiki/Regional_indicator_symbol
 */

const isRegionalIndicator = (code: number): boolean => {
  return code >= 0x1f1e6 && code <= 0x1f1ff
}

/**
 * Is `code` from basic multilingual plane.
 *
 * https://codepoints.net/basic_multilingual_plane
 */

const isBMP = (code: number): boolean => {
  return code <= 0xffff
}

/**
 * Is `code` a Zero Width Joiner.
 *
 * https://emojipedia.org/zero-width-joiner/
 */

const isZWJ = (code: number): boolean => {
  return code === 0x200d
}

/**
 * Is `code` a Black Flag.
 *
 * https://emojipedia.org/black-flag/
 */

const isBlackFlag = (code: number): boolean => {
  return code === 0x1f3f4
}

/**
 * Is `code` a Tag.
 *
 * https://emojipedia.org/emoji-tag-sequence/
 */

const isTag = (code: number): boolean => {
  return code >= 0xe0000 && code <= 0xe007f
}

/**
 * Is `code` a Cancel Tag.
 *
 * https://emojipedia.org/cancel-tag/
 */

const isCancelTag = (code: number): boolean => {
  return code === 0xe007f
}
