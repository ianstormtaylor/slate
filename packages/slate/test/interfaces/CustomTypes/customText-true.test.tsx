import { test, expect } from 'vitest'
import { Text } from 'slate'
import { isCustomText } from './type-guards'

test('customText-true', () => {
  const input: Text = {
    placeholder: 'mystring',
    text: 'mytext',
  }

  const test = isCustomText

  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
