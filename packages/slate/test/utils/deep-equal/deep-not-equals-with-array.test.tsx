import { test, expect } from 'vitest'
import { isDeepEqual } from '../../../src/utils/deep-equal'

test('deep-equal-deep-not-equals-with-array', () => {
  const input = {
    objectA: {
      text: 'same text',
      array: ['array-content'],
      bold: true,
    },
    objectB: {
      text: 'same text',
      array: ['array-content'],
      bold: false,
    },
  }

  const test = ({ objectA, objectB }) => {
    return isDeepEqual(objectA, objectB)
  }

  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
