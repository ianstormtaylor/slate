import { test, expect } from 'vitest'
import { Text } from 'slate'

test('matches-undefined-true', () => {
  const input = {
    text: { foo: undefined },
    props: { foo: undefined },
  }

  const test = ({ text, props }) => {
    return Text.matches(text, props)
  }

  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
