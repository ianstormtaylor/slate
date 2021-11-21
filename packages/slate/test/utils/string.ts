import assert from 'assert'
import {
  codepointsIteratorRTL,
  getCharacterDistance,
  getWordDistance,
} from '../../src/utils/string'

const codepoints = [
  ['a', 1],
  ['0', 1],
  [' ', 1],
  ['# ', 1],
  ['* ', 1],
  ['2 ', 1],
  ['🙂', 2],
  ['☺️', 2],
  ['☺️', 2],
  ['⬅️', 2],
  ['🏴', 2],
  ['☺️a', 2, 1],
  ['🏁🇨🇳', 2, 4],
  ['🎌🇩🇪', 2, 4],
  ['🚩🇺🇸', 2, 4],
  ['🇨🇳🎌', 4, 2],
  ['🏴🏳️', 2, 3],
  ['🇷🇺🚩', 4, 2],
] as const

const zwjSequences = [
  ['👁‍🗨', 5],
  ['👨‍👩‍👧‍👧', 11],
  ['👩‍❤️‍👨', 8],
  ['🙋🏽‍♂️', 7],
  ['🙋‍♂️', 5],
  ['🕵️‍♀️', 6],
  ['👨🏿‍🦳', 7],
] as const

const regionalIndicatorSequences = [
  '🇧🇪',
  '🇧🇫',
  '🇧🇬',
  '🇧🇭',
  '🇧🇮',
  '🇧🇯',
  '🇧🇱',
  '🇧🇲',
  '🇧🇳',
  '🇧🇴',
]

const keycapSequences = [
  '#️⃣',
  '*️⃣',
  '0️⃣',
  '1️⃣',
  '2️⃣',
  '3️⃣',
  '4️⃣',
  '5️⃣',
  '6️⃣',
  '7️⃣',
  '8️⃣',
  '9️⃣',
]

const tagSequences = [
  ['🏴󠁧󠁢󠁥󠁮󠁧󠁿', 14],
  ['🏴󠁧󠁢󠁳󠁣󠁴󠁿', 14],
  ['🏴󠁧󠁢󠁷󠁬󠁳󠁿', 14],
] as const

// https://www.unicode.org/Public/UCD/latest/ucd/auxiliary/GraphemeBreakTest.html#samples
// In some strings, explicit Unicode code points are used to prevent accidental normalization.
const sampleStrings = {
  '2': ['a\u0308'],
  '3': [' ‍', 'ن'],
  '4': ['ن‍', ' '],
  '5': ['ᄀᄀ'],
  '6': ['가\u11a8', 'ᄀ'],
  '7': ['각ᆨ', 'ᄀ'],
  '8': ['🇦🇧', '🇨', 'b'],
  '9': ['a', '🇦🇧', '🇨', 'b'],
  '10': ['a', '🇦🇧‍', '🇨', 'b'],
  '11': ['a', '🇦‍', '🇧🇨', 'b'],
  '12': ['a', '🇦🇧', '🇨🇩', 'b'],
  '13': ['a‍'],
  '14': ['a\u0308', 'b'],
  '15': ['aः', 'b'],
  '16': ['a', '؀b'],
  '17': ['👶🏿', '👶'],
  '18': ['a🏿', '👶'],
  '19': ['a🏿', '👶‍🛑'],
  '20': ['👶🏿̈‍👶🏿'],
  '21': ['🛑‍🛑'],
  '22': ['a‍', '🛑'],
  '23': ['✁‍✁'],
  '24': ['a‍', '✁'],
}

const dirs = ['ltr', 'rtl']

dirs.forEach(dir => {
  const isRTL = dir === 'rtl'

  describe(`getCharacterDistance - ${dir}`, () => {
    codepoints.forEach(([str, ltrDist, rtlDist]) => {
      const dist = isRTL && rtlDist != null ? rtlDist : ltrDist

      it(str, () => {
        assert.strictEqual(getCharacterDistance(str + str, isRTL), dist)
      })
    })

    zwjSequences.forEach(([str, dist]) => {
      it(str, () => {
        assert.strictEqual(getCharacterDistance(str + str, isRTL), dist)
      })
    })

    regionalIndicatorSequences.forEach(str => {
      it(str, () => {
        assert.strictEqual(getCharacterDistance(str + str, isRTL), 4)
      })
    })

    keycapSequences.forEach(str => {
      it(str, () => {
        assert.strictEqual(getCharacterDistance(str + str, isRTL), 3)
      })
    })

    tagSequences.forEach(([str, dist]) => {
      it(str, () => {
        assert.strictEqual(getCharacterDistance(str + str, isRTL), dist)
      })
    })

    Object.entries(sampleStrings).forEach(([label, strs]) => {
      for (let i = 0; i < strs.length; i++) {
        let str = ''
        if (isRTL) {
          str = strs.slice(0, i + 1).join('')
        } else {
          str = strs.slice(i).join('')
        }
        it(`Sample string ${label}, boundary ${isRTL ? i : i + 1}`, () => {
          assert.strictEqual(getCharacterDistance(str, isRTL), strs[i].length)
        })
      }
    })
  })
})

const ltrCases = [
  ['hello foobarbaz', 5],
  ['🏴󠁧󠁢󠁥󠁮󠁧󠁿🏴󠁧󠁢󠁳󠁣󠁴󠁿 🏴󠁧󠁢󠁷󠁬󠁳󠁿', 28],
  ["Don't do this", 5],
  ["I'm ok", 3],
] as const

const rtlCases = [
  ['hello foobarbaz', 9],
  ['🏴󠁧󠁢󠁥󠁮󠁧󠁿🏴󠁧󠁢󠁳󠁣󠁴󠁿 🏴󠁧󠁢󠁷󠁬󠁳󠁿', 14],
  ["Don't", 5],
  ["Don't do this", 4],
  ["I'm", 3],
  ['Tags 🏴󠁧󠁢󠁥󠁮󠁧󠁿🏴󠁧󠁢󠁳󠁣󠁴󠁿', 28],
] as const

describe(`getWordDistance - ltr`, () => {
  ltrCases.forEach(([str, dist]) => {
    it(str, () => {
      assert.strictEqual(getWordDistance(str), dist)
    })
  })
})

describe(`getWordDistance - rtl`, () => {
  rtlCases.forEach(([str, dist]) => {
    it(str, () => {
      assert.strictEqual(getWordDistance(str, true), dist)
    })
  })
})

const cases = [
  ...[...codepoints, ...zwjSequences, ...tagSequences, ...rtlCases].map(
    ([str]) => str
  ),
  ...keycapSequences,
  ...regionalIndicatorSequences,
]

describe('codepointsIteratorRTL', () => {
  cases.forEach(str => {
    it(str, () => {
      const arr1 = [...codepointsIteratorRTL(str)]
      const arr2 = Array.from(str).reverse()

      assert.deepStrictEqual(arr1, arr2)
    })
  })
})
