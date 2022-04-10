import { test, expect } from 'vitest'
import { Text } from 'slate'

test('matches-undefined-false', () => {
  const input = {
    text: { foo: undefined },
    props: { bar: undefined },
  }

  const test = ({ text, props }) => {
    return Text.matches(text, props)
  }

  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
