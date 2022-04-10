import { test, expect } from 'vitest'
import { isDeepEqual } from '../../../src/utils/deep-equal'

test('deep-equal-deep-not-equal', () => {
  const input = {
    objectA: {
      text: 'same text',
      bold: true,
      italic: { origin: 'inherited', value: false },
    },
    objectB: {
      text: 'same text',
      bold: true,
      italic: { origin: 'inherited', value: true },
    },
  }

  const test = ({ objectA, objectB }) => {
    return isDeepEqual(objectA, objectB)
  }

  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
