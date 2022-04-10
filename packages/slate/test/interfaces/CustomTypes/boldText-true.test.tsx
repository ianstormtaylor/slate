import { test, expect } from 'vitest'
import { Text } from 'slate'
import { isBoldText } from './type-guards'

test('boldText-true', () => {
  // show that regular methods that are imported work as expected

  const input: Text = {
    bold: true,
    text: 'mytext',
  }

  const test = isBoldText

  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
