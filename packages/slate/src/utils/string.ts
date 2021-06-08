/**
 * Constants for string distance checking.
 */

const SPACE = /\s/
const PUNCTUATION = /[\u0021-\u0023\u0025-\u002A\u002C-\u002F\u003A\u003B\u003F\u0040\u005B-\u005D\u005F\u007B\u007D\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E3B\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/
const CHAMELEON = /['\u2018\u2019]/

/**
 * Get the distance to the end of the first character in a string of text.
 */

enum CodepointType {
  // ZWJ sequences consist of multiple emojis separated by ZWJ character.  They
  // are used to combine multiple emojis into one emoji.
  // https://en.wikipedia.org/wiki/Zero-width_joiner
  ZeroWidthJoiner,
  // Kecap sequences consit of a digit, an asterisk or a number sign followed by
  // the Combining Enclosing Keycap character. They are used to create emoji
  // with a keycap appearance.  https://emojipedia.org/emoji-keycap-sequence
  Keycap,
  // Modifiers are used in ZWJ sequences to apply a skin tone to an emoji.
  // https://en.wikipedia.org/wiki/Emoticons_(Unicode_block)#Emoji_modifiers
  Modifier,
  // Variation selectors are used to specify if a character should be displayed
  // as text or as an emoji.
  VariationSelector,
  // Flag sequences consist of a pair of regional indicators.
  // https://en.wikipedia.org/wiki/Regional_indicator_symbol
  RegionalIndicator,
  // Tag sequences consist of a Black Flag emoji followed by a series of Tag
  // codepoints, then the Cancel Tag codepoint.
  // https://en.wikipedia.org/wiki/Tags_(Unicode_block)
  Tag,
  Character,
}

export const getCharacterDistance = (str: string, isRTL = false): number => {
  const codepoints = isRTL ? codepointsIteratorRTL(str) : str
  const isLTR = !isRTL

  const [isKeycapStart, isKeycapEnd, isTagStart, isTagEnd] = isLTR
    ? [isKeycap, isCombiningEnclosingKeycap, isBlackFlag, isCancelTag]
    : [isCombiningEnclosingKeycap, isKeycap, isCancelTag, isBlackFlag]

  let distance = 0
  let previousType: CodepointType | null = null

  for (const codepoint of codepoints) {
    const code = codepoint.codePointAt(0)
    if (!code) break

    if (
      isLTR &&
      previousType === CodepointType.VariationSelector &&
      !isZWJ(code) &&
      !isKeycapEnd(code)
    ) {
      break
    }

    if (isZWJ(code)) {
      distance += codepoint.length
      previousType = CodepointType.ZeroWidthJoiner

      continue
    }

    if (isKeycapStart(code)) {
      if (previousType === CodepointType.Keycap) break

      distance += codepoint.length
      previousType = CodepointType.Keycap

      continue
    }
    if (isKeycapEnd(code)) {
      distance += codepoint.length
      break
    }

    if (isVariationSelector(code)) {
      if (isRTL && previousType === CodepointType.Character) break

      distance += codepoint.length

      previousType = CodepointType.VariationSelector

      continue
    }

    if (isModifier(code)) {
      distance += codepoint.length
      previousType = CodepointType.Modifier

      continue
    }

    if (isTagStart(code)) {
      if (previousType === CodepointType.Tag) break

      distance += codepoint.length
      previousType = CodepointType.Tag
      continue
    }
    if (previousType === CodepointType.Tag) {
      if (isTagEnd(code)) {
        distance += codepoint.length
        break
      }
      if (isTag(code)) {
        distance += codepoint.length
        continue
      }

      break
    }

    if (isRegionalIndicator(code)) {
      if (previousType && previousType !== CodepointType.RegionalIndicator) {
        break
      }

      distance += codepoint.length

      if (previousType === CodepointType.RegionalIndicator) break

      previousType = CodepointType.RegionalIndicator

      continue
    }

    // If previous and curent codepoints are regular characters. it means we are
    // not in a sequence.
    if (previousType === CodepointType.Character) break

    distance += codepoint.length
    previousType = CodepointType.Character

    continue
  }

  return distance || 1
}

/**
 * Get the distance to the end of the first word in a string of text.
 */

export const getWordDistance = (text: string, isRTL = false): number => {
  let dist = 0
  let started = false

  while (text.length > 0) {
    const charDist = getCharacterDistance(text, isRTL)
    const [char, remaining] = splitByCharacterDistance(text, charDist, isRTL)

    if (isWordCharacter(char, remaining, isRTL)) {
      started = true
      dist += charDist
    } else if (!started) {
      dist += charDist
    } else {
      break
    }

    text = remaining
  }

  return dist
}

/**
 * Split a string in two parts at a given distance starting from the end when
 * `isRTL` is set to `true`.
 */

export const splitByCharacterDistance = (
  str: string,
  dist: number,
  isRTL?: boolean
): [string, string] => {
  if (isRTL) {
    const at = str.length - dist
    return [str.slice(at, str.length), str.slice(0, at)]
  }

  return [str.slice(0, dist), str.slice(dist)]
}

/**
 * Check if a character is a word character. The `remaining` argument is used
 * because sometimes you must read subsequent characters to truly determine it.
 */

const isWordCharacter = (
  char: string,
  remaining: string,
  isRTL = false
): boolean => {
  if (SPACE.test(char)) {
    return false
  }

  // Chameleons count as word characters as long as they're in a word, so
  // recurse to see if the next one is a word character or not.
  if (CHAMELEON.test(char)) {
    const charDist = getCharacterDistance(remaining, isRTL)
    const [nextChar, nextRemaining] = splitByCharacterDistance(
      remaining,
      charDist,
      isRTL
    )

    if (isWordCharacter(nextChar, nextRemaining, isRTL)) {
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
 * Is `code` a Regional Indicator.
 *
 * https://en.wikipedia.org/wiki/Regional_indicator_symbol
 */

const isRegionalIndicator = (code: number): boolean => {
  return code >= 0x1f1e6 && code <= 0x1f1ff
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

/**
 * Iterate on codepoints from right to left.
 */

export const codepointsIteratorRTL = function*(str: string) {
  const end = str.length - 1

  for (let i = 0; i < str.length; i++) {
    const char1 = str.charAt(end - i)

    if (isLowSurrogate(char1.charCodeAt(0))) {
      const char2 = str.charAt(end - i - 1)
      if (isHighSurrogate(char2.charCodeAt(0))) {
        yield char2 + char1

        i++
        continue
      }
    }

    yield char1
  }
}

/**
 * Is `charCode` a high surrogate.
 *
 * https://en.wikipedia.org/wiki/Universal_Character_Set_characters#Surrogates
 */

const isHighSurrogate = (charCode: number) => {
  return charCode >= 0xd800 && charCode <= 0xdbff
}

/**
 * Is `charCode` a low surrogate.
 *
 * https://en.wikipedia.org/wiki/Universal_Character_Set_characters#Surrogates
 */

const isLowSurrogate = (charCode: number) => {
  return charCode >= 0xdc00 && charCode <= 0xdfff
}
