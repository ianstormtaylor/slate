import { test, expect } from 'vitest'
import { Text } from 'slate'

test('matches-match-true', () => {
  const input = {
    text: { text: '', bold: true },
    props: { bold: true },
  }
  const test = ({ text, props }) => {
    return Text.matches(text, props)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
