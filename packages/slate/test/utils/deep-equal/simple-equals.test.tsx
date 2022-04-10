import { test, expect } from 'vitest'
import { isDeepEqual } from '../../../src/utils/deep-equal'

test('deep-equal-simple-equals', () => {
  const input = {
    objectA: { text: 'same text', bold: true },
    objectB: { text: 'same text', bold: true },
  }

  const test = ({ objectA, objectB }) => {
    return isDeepEqual(objectA, objectB)
  }

  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
