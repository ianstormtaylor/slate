import { test, expect } from 'vitest'
import { Text } from 'slate'
import { isCustomText } from './type-guards'

test('customText-false', () => {
  const input: Text = {
    bold: true,
    text: 'mytext',
  }

  const test = isCustomText

  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
