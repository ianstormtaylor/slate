import { test, expect, describe } from 'vitest'
import { Range } from '../../src/interfaces/range'

describe.concurrent('Range', () => {
  test('edges-collapsed', () => {
    const input = {
      anchor: {
        path: [0],
        offset: 0,
      },
      focus: {
        path: [0],
        offset: 0,
      },
    }
    const test = range => {
      return Range.edges(range)
    }
    const output = [
      {
        path: [0],
        offset: 0,
      },
      {
        path: [0],
        offset: 0,
      },
    ]

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('equals-equal', () => {
    const input = {
      range: {
        anchor: {
          path: [0, 1],
          offset: 0,
        },
        focus: {
          path: [0, 1],
          offset: 0,
        },
      },
      another: {
        anchor: {
          path: [0, 1],
          offset: 0,
        },
        focus: {
          path: [0, 1],
          offset: 0,
        },
      },
    }
    const test = ({ range, another }) => {
      return Range.equals(range, another)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('equals-not-equal', () => {
    const input = {
      range: {
        anchor: {
          path: [0, 4],
          offset: 7,
        },
        focus: {
          path: [0, 4],
          offset: 7,
        },
      },
      another: {
        anchor: {
          path: [0, 1],
          offset: 0,
        },
        focus: {
          path: [0, 1],
          offset: 0,
        },
      },
    }
    const test = ({ range, another }) => {
      return Range.equals(range, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('includes-path-after', () => {
    const input = {
      range: {
        anchor: {
          path: [1],
          offset: 0,
        },
        focus: {
          path: [3],
          offset: 0,
        },
      },
      target: [4],
    }
    const test = ({ range, target }) => {
      return Range.includes(range, target)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('includes-path-before', () => {
    const input = {
      range: {
        anchor: {
          path: [1],
          offset: 0,
        },
        focus: {
          path: [3],
          offset: 0,
        },
      },
      target: [0],
    }
    const test = ({ range, target }) => {
      return Range.includes(range, target)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('includes-path-end', () => {
    const input = {
      range: {
        anchor: {
          path: [1],
          offset: 0,
        },
        focus: {
          path: [3],
          offset: 0,
        },
      },
      target: [3],
    }
    const test = ({ range, target }) => {
      return Range.includes(range, target)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('includes-path-inside', () => {
    const input = {
      range: {
        anchor: {
          path: [1],
          offset: 0,
        },
        focus: {
          path: [3],
          offset: 0,
        },
      },
      target: [2],
    }
    const test = ({ range, target }) => {
      return Range.includes(range, target)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('includes-path-start', () => {
    const input = {
      range: {
        anchor: {
          path: [1],
          offset: 0,
        },
        focus: {
          path: [3],
          offset: 0,
        },
      },
      target: [1],
    }
    const test = ({ range, target }) => {
      return Range.includes(range, target)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('includes-point-inside', () => {
    const input = {
      range: {
        anchor: {
          path: [1],
          offset: 0,
        },
        focus: {
          path: [3],
          offset: 0,
        },
      },
      target: {
        path: [2],
        offset: 0,
      },
    }
    const test = ({ range, target }) => {
      return Range.includes(range, target)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('includes-point-offset-before', () => {
    const input = {
      range: {
        anchor: {
          path: [1],
          offset: 3,
        },
        focus: {
          path: [3],
          offset: 0,
        },
      },
      target: {
        path: [1],
        offset: 0,
      },
    }
    const test = ({ range, target }) => {
      return Range.includes(range, target)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('includes-point-path-after', () => {
    const input = {
      range: {
        anchor: {
          path: [1],
          offset: 0,
        },
        focus: {
          path: [3],
          offset: 0,
        },
      },
      target: {
        path: [4],
        offset: 0,
      },
    }
    const test = ({ range, target }) => {
      return Range.includes(range, target)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('includes-point-path-before', () => {
    const input = {
      range: {
        anchor: {
          path: [1],
          offset: 0,
        },
        focus: {
          path: [3],
          offset: 0,
        },
      },
      target: {
        path: [0],
        offset: 0,
      },
    }
    const test = ({ range, target }) => {
      return Range.includes(range, target)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('includes-point-start', () => {
    const input = {
      range: {
        anchor: {
          path: [1],
          offset: 0,
        },
        focus: {
          path: [3],
          offset: 0,
        },
      },
      target: {
        path: [1],
        offset: 0,
      },
    }
    const test = ({ range, target }) => {
      return Range.includes(range, target)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isBackward-backward', () => {
    const input = {
      anchor: {
        path: [3],
        offset: 0,
      },
      focus: {
        path: [0],
        offset: 0,
      },
    }
    const test = range => {
      return Range.isBackward(range)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isBackward-collapsed', () => {
    const input = {
      anchor: {
        path: [0],
        offset: 0,
      },
      focus: {
        path: [0],
        offset: 0,
      },
    }
    const test = range => {
      return Range.isBackward(range)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isBackward-forward', () => {
    const input = {
      anchor: {
        path: [0],
        offset: 0,
      },
      focus: {
        path: [3],
        offset: 0,
      },
    }
    const test = range => {
      return Range.isBackward(range)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isCollapsed-collapsed', () => {
    const input = {
      anchor: {
        path: [0],
        offset: 0,
      },
      focus: {
        path: [0],
        offset: 0,
      },
    }
    const test = range => {
      return Range.isCollapsed(range)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isCollapsed-expanded', () => {
    const input = {
      anchor: {
        path: [0],
        offset: 0,
      },
      focus: {
        path: [3],
        offset: 0,
      },
    }
    const test = range => {
      return Range.isCollapsed(range)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isExpanded-collapsed', () => {
    const input = {
      anchor: {
        path: [0],
        offset: 0,
      },
      focus: {
        path: [0],
        offset: 0,
      },
    }
    const test = range => {
      return Range.isExpanded(range)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isExpanded-expanded', () => {
    const input = {
      anchor: {
        path: [0],
        offset: 0,
      },
      focus: {
        path: [3],
        offset: 0,
      },
    }
    const test = range => {
      return Range.isExpanded(range)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isForward-backward', () => {
    const input = {
      anchor: {
        path: [3],
        offset: 0,
      },
      focus: {
        path: [0],
        offset: 0,
      },
    }
    const test = range => {
      return Range.isForward(range)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isForward-collapsed', () => {
    const input = {
      anchor: {
        path: [0],
        offset: 0,
      },
      focus: {
        path: [0],
        offset: 0,
      },
    }
    const test = range => {
      return Range.isForward(range)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isForward-forward', () => {
    const input = {
      anchor: {
        path: [0],
        offset: 0,
      },
      focus: {
        path: [3],
        offset: 0,
      },
    }
    const test = range => {
      return Range.isForward(range)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isRange-boolean', () => {
    const input = true
    const test = value => {
      return Range.isRange(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isRange-custom-property', () => {
    const input = {
      anchor: {
        path: [0, 1],
        offset: 0,
      },
      focus: {
        path: [0, 1],
        offset: 0,
      },
      custom: 'value',
    }
    const test = value => {
      return Range.isRange(value)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isRange-object', () => {
    const input = {}
    const test = value => {
      return Range.isRange(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isRange-range', () => {
    const input = {
      anchor: {
        path: [0, 1],
        offset: 0,
      },
      focus: {
        path: [0, 1],
        offset: 0,
      },
    }
    const test = value => {
      return Range.isRange(value)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isRange-without-anchor', () => {
    const input = {
      focus: {
        path: [0, 1],
        offset: 0,
      },
    }
    const test = value => {
      return Range.isRange(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isRange-without-focus', () => {
    const input = {
      anchor: {
        path: [0, 1],
        offset: 0,
      },
    }
    const test = value => {
      return Range.isRange(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('points-full-selection', () => {
    const input = {
      anchor: {
        path: [0],
        offset: 0,
      },
      focus: {
        path: [0],
        offset: 0,
      },
    }
    const test = value => {
      return Array.from(Range.points(value))
    }
    const output = [
      [input.anchor, 'anchor'],
      [input.focus, 'focus'],
    ]

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('transform-inward-collapsed', () => {
    const input = {
      anchor: {
        path: [0, 0],
        offset: 1,
      },
      focus: {
        path: [0, 0],
        offset: 1,
      },
    }
    const test = value => {
      return Range.transform(
        value,
        {
          type: 'split_node',
          path: [0, 0],
          position: 1,
          properties: {},
        },
        { affinity: 'inward' }
      )
    }
    const output = {
      anchor: {
        path: [0, 1],
        offset: 0,
      },
      focus: {
        path: [0, 1],
        offset: 0,
      },
    }

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('transform-outward-collapsed', () => {
    /**
     * If a collapsed Range is transformed with affinity outward by an insert_text operation, it should expand.
     */

    const input = {
      anchor: {
        path: [0, 0],
        offset: 1,
      },
      focus: {
        path: [0, 0],
        offset: 1,
      },
    }
    const test = value => {
      return Range.transform(
        value,
        {
          type: 'insert_text',
          path: [0, 0],
          text: 'a',
          offset: 1,
          properties: {},
        },
        { affinity: 'outward' }
      )
    }
    const output = {
      anchor: {
        path: [0, 0],
        offset: 1,
      },
      focus: {
        path: [0, 0],
        offset: 2,
      },
    }

    const result = test(input)
    expect(result).toEqual(output)
  })
})
