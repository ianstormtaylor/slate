import { test, expect } from 'vitest'
import { Text } from 'slate'
import { isBoldText } from './type-guards'

test('boldText-false', () => {
  const input: Text = {
    placeholder: 'heading',
    bold: false,
    italic: false,
    text: 'mytext',
  }

  const test = isBoldText

  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
