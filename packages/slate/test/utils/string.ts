import assert from 'assert'
import { getCharacterDistance } from '../../src/utils/string'

const regularCases = [
  // ['a', 1],
  // ['0', 1],
  // [' ', 1],
  // ['🙂', 2],
  // ['⬅️', 2],
  ['🏴', 2],
] as const

const sequences = [
  ['👁‍🗨', 5],
  ['👨‍👩‍👧‍👧', 11],
  ['👨🏿‍🦳', 7],
] as const

const regionalIndicators = [
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

const keycaps = [
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

const tags = [
  ['🏴󠁧󠁢󠁥󠁮󠁧󠁿', 14],
  ['🏴󠁧󠁢󠁳󠁣󠁴󠁿', 14],
  ['🏴󠁧󠁢󠁷󠁬󠁳󠁿', 14],
] as const

describe('getCharacterDistance', () => {
  regularCases.forEach(([str, length]) => {
    it(`regular case ${str}`, () => {
      assert.strictEqual(getCharacterDistance(str + str), length)
    })
  })

  regionalIndicators.forEach(str => {
    it(`regional indicator ${str}`, () => {
      assert.strictEqual(getCharacterDistance(str + str), 4)
    })
  })

  keycaps.forEach(str => {
    it(`keycap ${str}`, () => {
      assert.strictEqual(getCharacterDistance(str + str), 3)
    })
  })

  tags.forEach(([str, length]) => {
    it(`tag ${str}`, () => {
      assert.strictEqual(getCharacterDistance(str + str), length)
    })
  })

  sequences.forEach(([str, length]) => {
    it(`sequence ${str}`, () => {
      assert.strictEqual(getCharacterDistance(str + str), length)
    })
  })
})
