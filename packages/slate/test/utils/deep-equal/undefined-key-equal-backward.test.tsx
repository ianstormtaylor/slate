import { test, expect } from 'vitest'
import { isDeepEqual } from '../../../src/utils/deep-equal'

test('deep-equal-undefined-key-equal-backward', () => {
  const input = {
    objectA: {
      text: 'same text',
    },
    objectB: {
      text: 'same text',
      bold: undefined,
    },
  }

  const test = ({ objectA, objectB }) => {
    return isDeepEqual(objectA, objectB)
  }

  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
