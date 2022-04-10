import { test, expect, describe } from 'vitest'
import { isDeepEqual } from '../src/utils/deep-equal'

describe.concurrent('utils', () => {
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

  test('deep-equal-deep-equals', () => {
    const input = {
      objectA: {
        text: 'same text',
        bold: true,
        italic: { origin: 'inherited', value: false },
      },
      objectB: {
        text: 'same text',
        bold: true,
        italic: { origin: 'inherited', value: false },
      },
    }

    const test = ({ objectA, objectB }) => {
      return isDeepEqual(objectA, objectB)
    }

    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('deep-equal-deep-not-equal-multiple-objects', () => {
    const input = {
      objectA: {
        text: 'same text',
        bold: true,
        italic: { origin: 'inherited', value: true },
        underline: { origin: 'inherited', value: false },
      },
      objectB: {
        text: 'same text',
        bold: true,
        italic: { origin: 'inherited', value: true },
        underline: { origin: 'inherited', value: true },
      },
    }

    const test = ({ objectA, objectB }) => {
      return isDeepEqual(objectA, objectB)
    }

    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('deep-equal-deep-not-equal-nested-undefined', () => {
    const input = {
      objectA: {
        text: 'same text',
        bold: true,
        italic: { origin: 'inherited', value: true },
        underline: { origin: 'inherited', value: false },
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

  test('deep-equal-simple-not-equal', () => {
    const input = {
      objectA: { text: 'same text', bold: true },
      objectB: { text: 'same text', bold: true, italic: true },
    }

    const test = ({ objectA, objectB }) => {
      return isDeepEqual(objectA, objectB)
    }

    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

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

  test('deep-equal-undefined-key-equal-forward', () => {
    const input = {
      objectA: {
        text: 'same text',
        bold: undefined,
      },
      objectB: {
        text: 'same text',
      },
    }

    const test = ({ objectA, objectB }) => {
      return isDeepEqual(objectA, objectB)
    }

    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })
})
