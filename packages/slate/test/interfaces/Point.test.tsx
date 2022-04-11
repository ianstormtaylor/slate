import { test, expect, describe } from 'vitest'
import { Point } from '../../src/interfaces/point'

describe.concurrent('Point', () => {
  test('compare-path-after-offset-after', () => {
    const input = {
      point: {
        path: [0, 4],
        offset: 7,
      },
      another: {
        path: [0, 1],
        offset: 3,
      },
    }
    const test = ({ point, another }) => {
      return Point.compare(point, another)
    }
    const output = 1

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('compare-path-after-offset-before', () => {
    const input = {
      point: {
        path: [0, 4],
        offset: 0,
      },
      another: {
        path: [0, 1],
        offset: 3,
      },
    }
    const test = ({ point, another }) => {
      return Point.compare(point, another)
    }
    const output = 1

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('compare-path-after-offset-equal', () => {
    const input = {
      point: {
        path: [0, 4],
        offset: 3,
      },
      another: {
        path: [0, 1],
        offset: 3,
      },
    }
    const test = ({ point, another }) => {
      return Point.compare(point, another)
    }
    const output = 1

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('compare-path-before-offset-after', () => {
    const input = {
      point: {
        path: [0, 0],
        offset: 4,
      },
      another: {
        path: [0, 1],
        offset: 0,
      },
    }
    const test = ({ point, another }) => {
      return Point.compare(point, another)
    }
    const output = -1

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('compare-path-before-offset-before', () => {
    const input = {
      point: {
        path: [0, 0],
        offset: 0,
      },
      another: {
        path: [0, 1],
        offset: 3,
      },
    }
    const test = ({ point, another }) => {
      return Point.compare(point, another)
    }
    const output = -1

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('compare-path-before-offset-equal', () => {
    const input = {
      point: {
        path: [0, 0],
        offset: 0,
      },
      another: {
        path: [0, 1],
        offset: 0,
      },
    }
    const test = ({ point, another }) => {
      return Point.compare(point, another)
    }
    const output = -1

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('compare-path-equal-offset-after', () => {
    const input = {
      point: {
        path: [0, 1],
        offset: 7,
      },
      another: {
        path: [0, 1],
        offset: 3,
      },
    }
    const test = ({ point, another }) => {
      return Point.compare(point, another)
    }
    const output = 1

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('compare-path-equal-offset-before', () => {
    const input = {
      point: {
        path: [0, 1],
        offset: 0,
      },
      another: {
        path: [0, 1],
        offset: 3,
      },
    }
    const test = ({ point, another }) => {
      return Point.compare(point, another)
    }
    const output = -1

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('compare-path-equal-offset-equal', () => {
    const input = {
      point: {
        path: [0, 1],
        offset: 7,
      },
      another: {
        path: [0, 1],
        offset: 7,
      },
    }
    const test = ({ point, another }) => {
      return Point.compare(point, another)
    }
    const output = 0

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('equals-path-after-offset-after', () => {
    const input = {
      point: {
        path: [0, 4],
        offset: 7,
      },
      another: {
        path: [0, 1],
        offset: 3,
      },
    }
    const test = ({ point, another }) => {
      return Point.equals(point, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('equals-path-after-offset-before', () => {
    const input = {
      point: {
        path: [0, 4],
        offset: 0,
      },
      another: {
        path: [0, 1],
        offset: 3,
      },
    }
    const test = ({ point, another }) => {
      return Point.equals(point, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('equals-path-after-offset-equal', () => {
    const input = {
      point: {
        path: [0, 4],
        offset: 3,
      },
      another: {
        path: [0, 1],
        offset: 3,
      },
    }
    const test = ({ point, another }) => {
      return Point.equals(point, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('equals-path-before-offset-after', () => {
    const input = {
      point: {
        path: [0, 0],
        offset: 4,
      },
      another: {
        path: [0, 1],
        offset: 0,
      },
    }
    const test = ({ point, another }) => {
      return Point.equals(point, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('equals-path-before-offset-before', () => {
    const input = {
      point: {
        path: [0, 0],
        offset: 0,
      },
      another: {
        path: [0, 1],
        offset: 3,
      },
    }
    const test = ({ point, another }) => {
      return Point.equals(point, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('equals-path-before-offset-equal', () => {
    const input = {
      point: {
        path: [0, 0],
        offset: 0,
      },
      another: {
        path: [0, 1],
        offset: 0,
      },
    }
    const test = ({ point, another }) => {
      return Point.equals(point, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('equals-path-equal-offset-after', () => {
    const input = {
      point: {
        path: [0, 1],
        offset: 7,
      },
      another: {
        path: [0, 1],
        offset: 3,
      },
    }
    const test = ({ point, another }) => {
      return Point.equals(point, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('equals-path-equal-offset-before', () => {
    const input = {
      point: {
        path: [0, 1],
        offset: 0,
      },
      another: {
        path: [0, 1],
        offset: 3,
      },
    }
    const test = ({ point, another }) => {
      return Point.equals(point, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('equals-path-equal-offset-equal', () => {
    const input = {
      point: {
        path: [0, 1],
        offset: 7,
      },
      another: {
        path: [0, 1],
        offset: 7,
      },
    }
    const test = ({ point, another }) => {
      return Point.equals(point, another)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isAfter-path-after-offset-after', () => {
    const input = {
      point: {
        path: [0, 4],
        offset: 7,
      },
      another: {
        path: [0, 1],
        offset: 3,
      },
    }
    const test = ({ point, another }) => {
      return Point.isAfter(point, another)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isAfter-path-after-offset-before', () => {
    const input = {
      point: {
        path: [0, 4],
        offset: 0,
      },
      another: {
        path: [0, 1],
        offset: 3,
      },
    }
    const test = ({ point, another }) => {
      return Point.isAfter(point, another)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isAfter-path-after-offset-equal', () => {
    const input = {
      point: {
        path: [0, 4],
        offset: 3,
      },
      another: {
        path: [0, 1],
        offset: 3,
      },
    }
    const test = ({ point, another }) => {
      return Point.isAfter(point, another)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isAfter-path-before-offset-after', () => {
    const input = {
      point: {
        path: [0, 0],
        offset: 4,
      },
      another: {
        path: [0, 1],
        offset: 0,
      },
    }
    const test = ({ point, another }) => {
      return Point.isAfter(point, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isAfter-path-before-offset-before', () => {
    const input = {
      point: {
        path: [0, 0],
        offset: 0,
      },
      another: {
        path: [0, 1],
        offset: 3,
      },
    }
    const test = ({ point, another }) => {
      return Point.isAfter(point, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isAfter-path-before-offset-equal', () => {
    const input = {
      point: {
        path: [0, 0],
        offset: 0,
      },
      another: {
        path: [0, 1],
        offset: 0,
      },
    }
    const test = ({ point, another }) => {
      return Point.isAfter(point, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isAfter-path-equal-offset-after', () => {
    const input = {
      point: {
        path: [0, 1],
        offset: 7,
      },
      another: {
        path: [0, 1],
        offset: 3,
      },
    }
    const test = ({ point, another }) => {
      return Point.isAfter(point, another)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isAfter-path-equal-offset-before', () => {
    const input = {
      point: {
        path: [0, 1],
        offset: 0,
      },
      another: {
        path: [0, 1],
        offset: 3,
      },
    }
    const test = ({ point, another }) => {
      return Point.isAfter(point, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isAfter-path-equal-offset-equal', () => {
    const input = {
      point: {
        path: [0, 1],
        offset: 7,
      },
      another: {
        path: [0, 1],
        offset: 7,
      },
    }
    const test = ({ point, another }) => {
      return Point.isAfter(point, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isBefore-path-after-offset-after', () => {
    const input = {
      point: {
        path: [0, 4],
        offset: 7,
      },
      another: {
        path: [0, 1],
        offset: 3,
      },
    }
    const test = ({ point, another }) => {
      return Point.isBefore(point, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isBefore-path-after-offset-before', () => {
    const input = {
      point: {
        path: [0, 4],
        offset: 0,
      },
      another: {
        path: [0, 1],
        offset: 3,
      },
    }
    const test = ({ point, another }) => {
      return Point.isBefore(point, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isBefore-path-after-offset-equal', () => {
    const input = {
      point: {
        path: [0, 4],
        offset: 3,
      },
      another: {
        path: [0, 1],
        offset: 3,
      },
    }
    const test = ({ point, another }) => {
      return Point.isBefore(point, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isBefore-path-before-offset-after', () => {
    const input = {
      point: {
        path: [0, 0],
        offset: 4,
      },
      another: {
        path: [0, 1],
        offset: 0,
      },
    }
    const test = ({ point, another }) => {
      return Point.isBefore(point, another)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isBefore-path-before-offset-before', () => {
    const input = {
      point: {
        path: [0, 0],
        offset: 0,
      },
      another: {
        path: [0, 1],
        offset: 3,
      },
    }
    const test = ({ point, another }) => {
      return Point.isBefore(point, another)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isBefore-path-before-offset-equal', () => {
    const input = {
      point: {
        path: [0, 0],
        offset: 0,
      },
      another: {
        path: [0, 1],
        offset: 0,
      },
    }
    const test = ({ point, another }) => {
      return Point.isBefore(point, another)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isBefore-path-equal-offset-after', () => {
    const input = {
      point: {
        path: [0, 1],
        offset: 7,
      },
      another: {
        path: [0, 1],
        offset: 3,
      },
    }
    const test = ({ point, another }) => {
      return Point.isBefore(point, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isBefore-path-equal-offset-before', () => {
    const input = {
      point: {
        path: [0, 1],
        offset: 0,
      },
      another: {
        path: [0, 1],
        offset: 3,
      },
    }
    const test = ({ point, another }) => {
      return Point.isBefore(point, another)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isBefore-path-equal-offset-equal', () => {
    const input = {
      point: {
        path: [0, 1],
        offset: 7,
      },
      another: {
        path: [0, 1],
        offset: 7,
      },
    }
    const test = ({ point, another }) => {
      return Point.isBefore(point, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isPoint-boolean', () => {
    const input = true
    const test = value => {
      return Point.isPoint(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isPoint-custom-property', () => {
    const input = {
      path: [0, 1],
      offset: 0,
      custom: 'value',
    }
    const test = value => {
      return Point.isPoint(value)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isPoint-object', () => {
    const input = {}
    const test = value => {
      return Point.isPoint(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isPoint-offset', () => {
    const input = 42
    const test = value => {
      return Point.isPoint(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isPoint-path', () => {
    const input = [0, 1]
    const test = value => {
      return Point.isPoint(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isPoint-point', () => {
    const input = {
      path: [0, 1],
      offset: 0,
    }
    const test = value => {
      return Point.isPoint(value)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isPoint-without-offset', () => {
    const input = {
      path: [0, 1],
    }
    const test = value => {
      return Point.isPoint(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isPoint-without-path', () => {
    const input = {
      offset: 0,
    }
    const test = value => {
      return Point.isPoint(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('transform-backward-insert-text-after-point', () => {
    const input = {
      path: [0, 0],
      offset: 0,
    }

    const test = value => {
      return Point.transform(
        value,
        {
          type: 'insert_text',
          path: [0, 0],
          text: 'a',
          offset: 1,
          properties: {},
        },
        { affinity: 'backward' }
      )
    }
    const output = {
      path: [0, 0],
      offset: 0,
    }

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('transform-backward-insert-text-at-point', () => {
    const input = {
      path: [0, 0],
      offset: 1,
    }

    const test = value => {
      return Point.transform(
        value,
        {
          type: 'insert_text',
          path: [0, 0],
          text: 'a',
          offset: 1,
          properties: {},
        },
        { affinity: 'backward' }
      )
    }
    const output = {
      path: [0, 0],
      offset: 1,
    }

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('transform-backward-insert-text-before-point', () => {
    const input = {
      path: [0, 0],
      offset: 1,
    }

    const test = value => {
      return Point.transform(
        value,
        {
          type: 'insert_text',
          path: [0, 0],
          text: 'a',
          offset: 0,
          properties: {},
        },
        { affinity: 'backward' }
      )
    }
    const output = {
      path: [0, 0],
      offset: 2,
    }

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('transform-forward-insert-text-after-point', () => {
    const input = {
      path: [0, 0],
      offset: 0,
    }

    const test = value => {
      return Point.transform(
        value,
        {
          type: 'insert_text',
          path: [0, 0],
          text: 'a',
          offset: 1,
          properties: {},
        },
        { affinity: 'forward' }
      )
    }
    const output = {
      path: [0, 0],
      offset: 0,
    }

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('transform-forward-insert-text-at-point', () => {
    const input = {
      path: [0, 0],
      offset: 1,
    }

    const test = value => {
      return Point.transform(
        value,
        {
          type: 'insert_text',
          path: [0, 0],
          text: 'a',
          offset: 1,
          properties: {},
        },
        { affinity: 'forward' }
      )
    }
    const output = {
      path: [0, 0],
      offset: 2,
    }

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('transform-forward-insert-text-before-point', () => {
    const input = {
      path: [0, 0],
      offset: 1,
    }

    const test = value => {
      return Point.transform(
        value,
        {
          type: 'insert_text',
          path: [0, 0],
          text: 'a',
          offset: 0,
          properties: {},
        },
        { affinity: 'forward' }
      )
    }
    const output = {
      path: [0, 0],
      offset: 2,
    }

    const result = test(input)
    expect(result).toEqual(output)
  })
})
