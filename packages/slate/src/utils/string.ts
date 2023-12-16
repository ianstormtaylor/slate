// Character (grapheme cluster) boundaries are determined according to
// the default grapheme cluster boundary specification, extended grapheme clusters variant[1].
//
// References:
//
// [1] https://www.unicode.org/reports/tr29/#Default_Grapheme_Cluster_Table
// [2] https://www.unicode.org/Public/UCD/latest/ucd/auxiliary/GraphemeBreakProperty.txt
// [3] https://www.unicode.org/Public/UCD/latest/ucd/auxiliary/GraphemeBreakTest.html
// [4] https://www.unicode.org/Public/UCD/latest/ucd/auxiliary/GraphemeBreakTest.txt

/**
 * Get the distance to the end of the first character in a string of text.
 */

export const getCharacterDistance = (str: string, isRTL = false): number => {
  const isLTR = !isRTL
  const codepoints = isRTL ? codepointsIteratorRTL(str) : str

  let left: CodepointType = CodepointType.None
  let right: CodepointType = CodepointType.None
  let distance = 0
  // Evaluation of these conditions are deferred.
  let gb11: boolean | null = null // Is GB11 applicable?
  let gb12Or13: boolean | null = null // Is GB12 or GB13 applicable?

  for (const char of codepoints) {
    const code = char.codePointAt(0)
    if (!code) break

    const type = getCodepointType(char, code)
    ;[left, right] = isLTR ? [right, type] : [type, left]

    if (
      intersects(left, CodepointType.ZWJ) &&
      intersects(right, CodepointType.ExtPict)
    ) {
      if (isLTR) {
        gb11 = endsWithEmojiZWJ(str.substring(0, distance))
      } else {
        gb11 = endsWithEmojiZWJ(str.substring(0, str.length - distance))
      }
      if (!gb11) break
    }

    if (
      intersects(left, CodepointType.RI) &&
      intersects(right, CodepointType.RI)
    ) {
      if (gb12Or13 !== null) {
        gb12Or13 = !gb12Or13
      } else {
        if (isLTR) {
          gb12Or13 = true
        } else {
          gb12Or13 = endsWithOddNumberOfRIs(
            str.substring(0, str.length - distance)
          )
        }
      }
      if (!gb12Or13) break
    }

    if (
      left !== CodepointType.None &&
      right !== CodepointType.None &&
      isBoundaryPair(left, right)
    ) {
      break
    }

    distance += char.length
  }

  return distance || 1
}

const SPACE = /\s/
const PUNCTUATION =
  /[\u002B\u0021-\u0023\u0025-\u002A\u002C-\u002F\u003A\u003B\u003F\u0040\u005B-\u005D\u005F\u007B\u007D\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E3B\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/
const CHAMELEON = /['\u2018\u2019]/

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
 * Iterate on codepoints from right to left.
 */

export const codepointsIteratorRTL = function* (str: string) {
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

enum CodepointType {
  None = 0,
  Extend = 1 << 0,
  ZWJ = 1 << 1,
  RI = 1 << 2,
  Prepend = 1 << 3,
  SpacingMark = 1 << 4,
  L = 1 << 5,
  V = 1 << 6,
  T = 1 << 7,
  LV = 1 << 8,
  LVT = 1 << 9,
  ExtPict = 1 << 10,
  Any = 1 << 11,
}

const reExtend = /^[\p{Gr_Ext}\p{EMod}]$/u
const rePrepend =
  /^[\u0600-\u0605\u06DD\u070F\u0890-\u0891\u08E2\u0D4E\u{110BD}\u{110CD}\u{111C2}-\u{111C3}\u{1193F}\u{11941}\u{11A3A}\u{11A84}-\u{11A89}\u{11D46}]$/u
const reSpacingMark =
  /^[\u0903\u093B\u093E-\u0940\u0949-\u094C\u094E-\u094F\u0982-\u0983\u09BF-\u09C0\u09C7-\u09C8\u09CB-\u09CC\u0A03\u0A3E-\u0A40\u0A83\u0ABE-\u0AC0\u0AC9\u0ACB-\u0ACC\u0B02-\u0B03\u0B40\u0B47-\u0B48\u0B4B-\u0B4C\u0BBF\u0BC1-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0C01-\u0C03\u0C41-\u0C44\u0C82-\u0C83\u0CBE\u0CC0-\u0CC1\u0CC3-\u0CC4\u0CC7-\u0CC8\u0CCA-\u0CCB\u0D02-\u0D03\u0D3F-\u0D40\u0D46-\u0D48\u0D4A-\u0D4C\u0D82-\u0D83\u0DD0-\u0DD1\u0DD8-\u0DDE\u0DF2-\u0DF3\u0E33\u0EB3\u0F3E-\u0F3F\u0F7F\u1031\u103B-\u103C\u1056-\u1057\u1084\u1715\u1734\u17B6\u17BE-\u17C5\u17C7-\u17C8\u1923-\u1926\u1929-\u192B\u1930-\u1931\u1933-\u1938\u1A19-\u1A1A\u1A55\u1A57\u1A6D-\u1A72\u1B04\u1B3B\u1B3D-\u1B41\u1B43-\u1B44\u1B82\u1BA1\u1BA6-\u1BA7\u1BAA\u1BE7\u1BEA-\u1BEC\u1BEE\u1BF2-\u1BF3\u1C24-\u1C2B\u1C34-\u1C35\u1CE1\u1CF7\uA823-\uA824\uA827\uA880-\uA881\uA8B4-\uA8C3\uA952-\uA953\uA983\uA9B4-\uA9B5\uA9BA-\uA9BB\uA9BE-\uA9C0\uAA2F-\uAA30\uAA33-\uAA34\uAA4D\uAAEB\uAAEE-\uAAEF\uAAF5\uABE3-\uABE4\uABE6-\uABE7\uABE9-\uABEA\uABEC\u{11000}\u{11002}\u{11082}\u{110B0}-\u{110B2}\u{110B7}-\u{110B8}\u{1112C}\u{11145}-\u{11146}\u{11182}\u{111B3}-\u{111B5}\u{111BF}-\u{111C0}\u{111CE}\u{1122C}-\u{1122E}\u{11232}-\u{11233}\u{11235}\u{112E0}-\u{112E2}\u{11302}-\u{11303}\u{1133F}\u{11341}-\u{11344}\u{11347}-\u{11348}\u{1134B}-\u{1134D}\u{11362}-\u{11363}\u{11435}-\u{11437}\u{11440}-\u{11441}\u{11445}\u{114B1}-\u{114B2}\u{114B9}\u{114BB}-\u{114BC}\u{114BE}\u{114C1}\u{115B0}-\u{115B1}\u{115B8}-\u{115BB}\u{115BE}\u{11630}-\u{11632}\u{1163B}-\u{1163C}\u{1163E}\u{116AC}\u{116AE}-\u{116AF}\u{116B6}\u{11726}\u{1182C}-\u{1182E}\u{11838}\u{11931}-\u{11935}\u{11937}-\u{11938}\u{1193D}\u{11940}\u{11942}\u{119D1}-\u{119D3}\u{119DC}-\u{119DF}\u{119E4}\u{11A39}\u{11A57}-\u{11A58}\u{11A97}\u{11C2F}\u{11C3E}\u{11CA9}\u{11CB1}\u{11CB4}\u{11D8A}-\u{11D8E}\u{11D93}-\u{11D94}\u{11D96}\u{11EF5}-\u{11EF6}\u{16F51}-\u{16F87}\u{16FF0}-\u{16FF1}\u{1D166}\u{1D16D}]$/u
const reL = /^[\u1100-\u115F\uA960-\uA97C]$/u
const reV = /^[\u1160-\u11A7\uD7B0-\uD7C6]$/u
const reT = /^[\u11A8-\u11FF\uD7CB-\uD7FB]$/u
const reLV =
  /^[\uAC00\uAC1C\uAC38\uAC54\uAC70\uAC8C\uACA8\uACC4\uACE0\uACFC\uAD18\uAD34\uAD50\uAD6C\uAD88\uADA4\uADC0\uADDC\uADF8\uAE14\uAE30\uAE4C\uAE68\uAE84\uAEA0\uAEBC\uAED8\uAEF4\uAF10\uAF2C\uAF48\uAF64\uAF80\uAF9C\uAFB8\uAFD4\uAFF0\uB00C\uB028\uB044\uB060\uB07C\uB098\uB0B4\uB0D0\uB0EC\uB108\uB124\uB140\uB15C\uB178\uB194\uB1B0\uB1CC\uB1E8\uB204\uB220\uB23C\uB258\uB274\uB290\uB2AC\uB2C8\uB2E4\uB300\uB31C\uB338\uB354\uB370\uB38C\uB3A8\uB3C4\uB3E0\uB3FC\uB418\uB434\uB450\uB46C\uB488\uB4A4\uB4C0\uB4DC\uB4F8\uB514\uB530\uB54C\uB568\uB584\uB5A0\uB5BC\uB5D8\uB5F4\uB610\uB62C\uB648\uB664\uB680\uB69C\uB6B8\uB6D4\uB6F0\uB70C\uB728\uB744\uB760\uB77C\uB798\uB7B4\uB7D0\uB7EC\uB808\uB824\uB840\uB85C\uB878\uB894\uB8B0\uB8CC\uB8E8\uB904\uB920\uB93C\uB958\uB974\uB990\uB9AC\uB9C8\uB9E4\uBA00\uBA1C\uBA38\uBA54\uBA70\uBA8C\uBAA8\uBAC4\uBAE0\uBAFC\uBB18\uBB34\uBB50\uBB6C\uBB88\uBBA4\uBBC0\uBBDC\uBBF8\uBC14\uBC30\uBC4C\uBC68\uBC84\uBCA0\uBCBC\uBCD8\uBCF4\uBD10\uBD2C\uBD48\uBD64\uBD80\uBD9C\uBDB8\uBDD4\uBDF0\uBE0C\uBE28\uBE44\uBE60\uBE7C\uBE98\uBEB4\uBED0\uBEEC\uBF08\uBF24\uBF40\uBF5C\uBF78\uBF94\uBFB0\uBFCC\uBFE8\uC004\uC020\uC03C\uC058\uC074\uC090\uC0AC\uC0C8\uC0E4\uC100\uC11C\uC138\uC154\uC170\uC18C\uC1A8\uC1C4\uC1E0\uC1FC\uC218\uC234\uC250\uC26C\uC288\uC2A4\uC2C0\uC2DC\uC2F8\uC314\uC330\uC34C\uC368\uC384\uC3A0\uC3BC\uC3D8\uC3F4\uC410\uC42C\uC448\uC464\uC480\uC49C\uC4B8\uC4D4\uC4F0\uC50C\uC528\uC544\uC560\uC57C\uC598\uC5B4\uC5D0\uC5EC\uC608\uC624\uC640\uC65C\uC678\uC694\uC6B0\uC6CC\uC6E8\uC704\uC720\uC73C\uC758\uC774\uC790\uC7AC\uC7C8\uC7E4\uC800\uC81C\uC838\uC854\uC870\uC88C\uC8A8\uC8C4\uC8E0\uC8FC\uC918\uC934\uC950\uC96C\uC988\uC9A4\uC9C0\uC9DC\uC9F8\uCA14\uCA30\uCA4C\uCA68\uCA84\uCAA0\uCABC\uCAD8\uCAF4\uCB10\uCB2C\uCB48\uCB64\uCB80\uCB9C\uCBB8\uCBD4\uCBF0\uCC0C\uCC28\uCC44\uCC60\uCC7C\uCC98\uCCB4\uCCD0\uCCEC\uCD08\uCD24\uCD40\uCD5C\uCD78\uCD94\uCDB0\uCDCC\uCDE8\uCE04\uCE20\uCE3C\uCE58\uCE74\uCE90\uCEAC\uCEC8\uCEE4\uCF00\uCF1C\uCF38\uCF54\uCF70\uCF8C\uCFA8\uCFC4\uCFE0\uCFFC\uD018\uD034\uD050\uD06C\uD088\uD0A4\uD0C0\uD0DC\uD0F8\uD114\uD130\uD14C\uD168\uD184\uD1A0\uD1BC\uD1D8\uD1F4\uD210\uD22C\uD248\uD264\uD280\uD29C\uD2B8\uD2D4\uD2F0\uD30C\uD328\uD344\uD360\uD37C\uD398\uD3B4\uD3D0\uD3EC\uD408\uD424\uD440\uD45C\uD478\uD494\uD4B0\uD4CC\uD4E8\uD504\uD520\uD53C\uD558\uD574\uD590\uD5AC\uD5C8\uD5E4\uD600\uD61C\uD638\uD654\uD670\uD68C\uD6A8\uD6C4\uD6E0\uD6FC\uD718\uD734\uD750\uD76C\uD788]$/u
const reLVT =
  /^[\uAC01-\uAC1B\uAC1D-\uAC37\uAC39-\uAC53\uAC55-\uAC6F\uAC71-\uAC8B\uAC8D-\uACA7\uACA9-\uACC3\uACC5-\uACDF\uACE1-\uACFB\uACFD-\uAD17\uAD19-\uAD33\uAD35-\uAD4F\uAD51-\uAD6B\uAD6D-\uAD87\uAD89-\uADA3\uADA5-\uADBF\uADC1-\uADDB\uADDD-\uADF7\uADF9-\uAE13\uAE15-\uAE2F\uAE31-\uAE4B\uAE4D-\uAE67\uAE69-\uAE83\uAE85-\uAE9F\uAEA1-\uAEBB\uAEBD-\uAED7\uAED9-\uAEF3\uAEF5-\uAF0F\uAF11-\uAF2B\uAF2D-\uAF47\uAF49-\uAF63\uAF65-\uAF7F\uAF81-\uAF9B\uAF9D-\uAFB7\uAFB9-\uAFD3\uAFD5-\uAFEF\uAFF1-\uB00B\uB00D-\uB027\uB029-\uB043\uB045-\uB05F\uB061-\uB07B\uB07D-\uB097\uB099-\uB0B3\uB0B5-\uB0CF\uB0D1-\uB0EB\uB0ED-\uB107\uB109-\uB123\uB125-\uB13F\uB141-\uB15B\uB15D-\uB177\uB179-\uB193\uB195-\uB1AF\uB1B1-\uB1CB\uB1CD-\uB1E7\uB1E9-\uB203\uB205-\uB21F\uB221-\uB23B\uB23D-\uB257\uB259-\uB273\uB275-\uB28F\uB291-\uB2AB\uB2AD-\uB2C7\uB2C9-\uB2E3\uB2E5-\uB2FF\uB301-\uB31B\uB31D-\uB337\uB339-\uB353\uB355-\uB36F\uB371-\uB38B\uB38D-\uB3A7\uB3A9-\uB3C3\uB3C5-\uB3DF\uB3E1-\uB3FB\uB3FD-\uB417\uB419-\uB433\uB435-\uB44F\uB451-\uB46B\uB46D-\uB487\uB489-\uB4A3\uB4A5-\uB4BF\uB4C1-\uB4DB\uB4DD-\uB4F7\uB4F9-\uB513\uB515-\uB52F\uB531-\uB54B\uB54D-\uB567\uB569-\uB583\uB585-\uB59F\uB5A1-\uB5BB\uB5BD-\uB5D7\uB5D9-\uB5F3\uB5F5-\uB60F\uB611-\uB62B\uB62D-\uB647\uB649-\uB663\uB665-\uB67F\uB681-\uB69B\uB69D-\uB6B7\uB6B9-\uB6D3\uB6D5-\uB6EF\uB6F1-\uB70B\uB70D-\uB727\uB729-\uB743\uB745-\uB75F\uB761-\uB77B\uB77D-\uB797\uB799-\uB7B3\uB7B5-\uB7CF\uB7D1-\uB7EB\uB7ED-\uB807\uB809-\uB823\uB825-\uB83F\uB841-\uB85B\uB85D-\uB877\uB879-\uB893\uB895-\uB8AF\uB8B1-\uB8CB\uB8CD-\uB8E7\uB8E9-\uB903\uB905-\uB91F\uB921-\uB93B\uB93D-\uB957\uB959-\uB973\uB975-\uB98F\uB991-\uB9AB\uB9AD-\uB9C7\uB9C9-\uB9E3\uB9E5-\uB9FF\uBA01-\uBA1B\uBA1D-\uBA37\uBA39-\uBA53\uBA55-\uBA6F\uBA71-\uBA8B\uBA8D-\uBAA7\uBAA9-\uBAC3\uBAC5-\uBADF\uBAE1-\uBAFB\uBAFD-\uBB17\uBB19-\uBB33\uBB35-\uBB4F\uBB51-\uBB6B\uBB6D-\uBB87\uBB89-\uBBA3\uBBA5-\uBBBF\uBBC1-\uBBDB\uBBDD-\uBBF7\uBBF9-\uBC13\uBC15-\uBC2F\uBC31-\uBC4B\uBC4D-\uBC67\uBC69-\uBC83\uBC85-\uBC9F\uBCA1-\uBCBB\uBCBD-\uBCD7\uBCD9-\uBCF3\uBCF5-\uBD0F\uBD11-\uBD2B\uBD2D-\uBD47\uBD49-\uBD63\uBD65-\uBD7F\uBD81-\uBD9B\uBD9D-\uBDB7\uBDB9-\uBDD3\uBDD5-\uBDEF\uBDF1-\uBE0B\uBE0D-\uBE27\uBE29-\uBE43\uBE45-\uBE5F\uBE61-\uBE7B\uBE7D-\uBE97\uBE99-\uBEB3\uBEB5-\uBECF\uBED1-\uBEEB\uBEED-\uBF07\uBF09-\uBF23\uBF25-\uBF3F\uBF41-\uBF5B\uBF5D-\uBF77\uBF79-\uBF93\uBF95-\uBFAF\uBFB1-\uBFCB\uBFCD-\uBFE7\uBFE9-\uC003\uC005-\uC01F\uC021-\uC03B\uC03D-\uC057\uC059-\uC073\uC075-\uC08F\uC091-\uC0AB\uC0AD-\uC0C7\uC0C9-\uC0E3\uC0E5-\uC0FF\uC101-\uC11B\uC11D-\uC137\uC139-\uC153\uC155-\uC16F\uC171-\uC18B\uC18D-\uC1A7\uC1A9-\uC1C3\uC1C5-\uC1DF\uC1E1-\uC1FB\uC1FD-\uC217\uC219-\uC233\uC235-\uC24F\uC251-\uC26B\uC26D-\uC287\uC289-\uC2A3\uC2A5-\uC2BF\uC2C1-\uC2DB\uC2DD-\uC2F7\uC2F9-\uC313\uC315-\uC32F\uC331-\uC34B\uC34D-\uC367\uC369-\uC383\uC385-\uC39F\uC3A1-\uC3BB\uC3BD-\uC3D7\uC3D9-\uC3F3\uC3F5-\uC40F\uC411-\uC42B\uC42D-\uC447\uC449-\uC463\uC465-\uC47F\uC481-\uC49B\uC49D-\uC4B7\uC4B9-\uC4D3\uC4D5-\uC4EF\uC4F1-\uC50B\uC50D-\uC527\uC529-\uC543\uC545-\uC55F\uC561-\uC57B\uC57D-\uC597\uC599-\uC5B3\uC5B5-\uC5CF\uC5D1-\uC5EB\uC5ED-\uC607\uC609-\uC623\uC625-\uC63F\uC641-\uC65B\uC65D-\uC677\uC679-\uC693\uC695-\uC6AF\uC6B1-\uC6CB\uC6CD-\uC6E7\uC6E9-\uC703\uC705-\uC71F\uC721-\uC73B\uC73D-\uC757\uC759-\uC773\uC775-\uC78F\uC791-\uC7AB\uC7AD-\uC7C7\uC7C9-\uC7E3\uC7E5-\uC7FF\uC801-\uC81B\uC81D-\uC837\uC839-\uC853\uC855-\uC86F\uC871-\uC88B\uC88D-\uC8A7\uC8A9-\uC8C3\uC8C5-\uC8DF\uC8E1-\uC8FB\uC8FD-\uC917\uC919-\uC933\uC935-\uC94F\uC951-\uC96B\uC96D-\uC987\uC989-\uC9A3\uC9A5-\uC9BF\uC9C1-\uC9DB\uC9DD-\uC9F7\uC9F9-\uCA13\uCA15-\uCA2F\uCA31-\uCA4B\uCA4D-\uCA67\uCA69-\uCA83\uCA85-\uCA9F\uCAA1-\uCABB\uCABD-\uCAD7\uCAD9-\uCAF3\uCAF5-\uCB0F\uCB11-\uCB2B\uCB2D-\uCB47\uCB49-\uCB63\uCB65-\uCB7F\uCB81-\uCB9B\uCB9D-\uCBB7\uCBB9-\uCBD3\uCBD5-\uCBEF\uCBF1-\uCC0B\uCC0D-\uCC27\uCC29-\uCC43\uCC45-\uCC5F\uCC61-\uCC7B\uCC7D-\uCC97\uCC99-\uCCB3\uCCB5-\uCCCF\uCCD1-\uCCEB\uCCED-\uCD07\uCD09-\uCD23\uCD25-\uCD3F\uCD41-\uCD5B\uCD5D-\uCD77\uCD79-\uCD93\uCD95-\uCDAF\uCDB1-\uCDCB\uCDCD-\uCDE7\uCDE9-\uCE03\uCE05-\uCE1F\uCE21-\uCE3B\uCE3D-\uCE57\uCE59-\uCE73\uCE75-\uCE8F\uCE91-\uCEAB\uCEAD-\uCEC7\uCEC9-\uCEE3\uCEE5-\uCEFF\uCF01-\uCF1B\uCF1D-\uCF37\uCF39-\uCF53\uCF55-\uCF6F\uCF71-\uCF8B\uCF8D-\uCFA7\uCFA9-\uCFC3\uCFC5-\uCFDF\uCFE1-\uCFFB\uCFFD-\uD017\uD019-\uD033\uD035-\uD04F\uD051-\uD06B\uD06D-\uD087\uD089-\uD0A3\uD0A5-\uD0BF\uD0C1-\uD0DB\uD0DD-\uD0F7\uD0F9-\uD113\uD115-\uD12F\uD131-\uD14B\uD14D-\uD167\uD169-\uD183\uD185-\uD19F\uD1A1-\uD1BB\uD1BD-\uD1D7\uD1D9-\uD1F3\uD1F5-\uD20F\uD211-\uD22B\uD22D-\uD247\uD249-\uD263\uD265-\uD27F\uD281-\uD29B\uD29D-\uD2B7\uD2B9-\uD2D3\uD2D5-\uD2EF\uD2F1-\uD30B\uD30D-\uD327\uD329-\uD343\uD345-\uD35F\uD361-\uD37B\uD37D-\uD397\uD399-\uD3B3\uD3B5-\uD3CF\uD3D1-\uD3EB\uD3ED-\uD407\uD409-\uD423\uD425-\uD43F\uD441-\uD45B\uD45D-\uD477\uD479-\uD493\uD495-\uD4AF\uD4B1-\uD4CB\uD4CD-\uD4E7\uD4E9-\uD503\uD505-\uD51F\uD521-\uD53B\uD53D-\uD557\uD559-\uD573\uD575-\uD58F\uD591-\uD5AB\uD5AD-\uD5C7\uD5C9-\uD5E3\uD5E5-\uD5FF\uD601-\uD61B\uD61D-\uD637\uD639-\uD653\uD655-\uD66F\uD671-\uD68B\uD68D-\uD6A7\uD6A9-\uD6C3\uD6C5-\uD6DF\uD6E1-\uD6FB\uD6FD-\uD717\uD719-\uD733\uD735-\uD74F\uD751-\uD76B\uD76D-\uD787\uD789-\uD7A3]$/u
const reExtPict = /^\p{ExtPict}$/u

const getCodepointType = (char: string, code: number): CodepointType => {
  let type = CodepointType.Any
  if (char.search(reExtend) !== -1) {
    type |= CodepointType.Extend
  }
  if (code === 0x200d) {
    type |= CodepointType.ZWJ
  }
  if (code >= 0x1f1e6 && code <= 0x1f1ff) {
    type |= CodepointType.RI
  }
  if (char.search(rePrepend) !== -1) {
    type |= CodepointType.Prepend
  }
  if (char.search(reSpacingMark) !== -1) {
    type |= CodepointType.SpacingMark
  }
  if (char.search(reL) !== -1) {
    type |= CodepointType.L
  }
  if (char.search(reV) !== -1) {
    type |= CodepointType.V
  }
  if (char.search(reT) !== -1) {
    type |= CodepointType.T
  }
  if (char.search(reLV) !== -1) {
    type |= CodepointType.LV
  }
  if (char.search(reLVT) !== -1) {
    type |= CodepointType.LVT
  }
  if (char.search(reExtPict) !== -1) {
    type |= CodepointType.ExtPict
  }

  return type
}

function intersects(x: CodepointType, y: CodepointType) {
  return (x & y) !== 0
}

const NonBoundaryPairs: [CodepointType, CodepointType][] = [
  // GB6
  [
    CodepointType.L,
    CodepointType.L | CodepointType.V | CodepointType.LV | CodepointType.LVT,
  ],
  // GB7
  [CodepointType.LV | CodepointType.V, CodepointType.V | CodepointType.T],
  // GB8
  [CodepointType.LVT | CodepointType.T, CodepointType.T],
  // GB9
  [CodepointType.Any, CodepointType.Extend | CodepointType.ZWJ],
  // GB9a
  [CodepointType.Any, CodepointType.SpacingMark],
  // GB9b
  [CodepointType.Prepend, CodepointType.Any],
  // GB11
  [CodepointType.ZWJ, CodepointType.ExtPict],
  // GB12 and GB13
  [CodepointType.RI, CodepointType.RI],
]

function isBoundaryPair(left: CodepointType, right: CodepointType) {
  return (
    NonBoundaryPairs.findIndex(
      r => intersects(left, r[0]) && intersects(right, r[1])
    ) === -1
  )
}

const endingEmojiZWJ = /\p{ExtPict}[\p{Gr_Ext}\p{EMod}]*\u200D$/u
const endsWithEmojiZWJ = (str: string): boolean => {
  return str.search(endingEmojiZWJ) !== -1
}

const endingRIs = /\p{RI}+$/gu
const endsWithOddNumberOfRIs = (str: string): boolean => {
  const match = str.match(endingRIs)
  if (match === null) {
    return false
  } else {
    // A RI is represented by a surrogate pair.
    const numRIs = match[0].length / 2
    return numRIs % 2 === 1
  }
}
