import { test, expect } from 'vitest'
import { isDeepEqual } from '../../../src/utils/deep-equal'

test('deep-equal-deep-equals-with-array', () => {
  const input = {
    objectA: {
      text: 'same text',
      array: ['array-content'],
      bold: true,
    },
    objectB: {
      text: 'same text',
      array: ['array-content'],
      bold: true,
    },
  }

  const test = ({ objectA, objectB }) => {
    return isDeepEqual(objectA, objectB)
  }

  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
