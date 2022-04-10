import { test, expect, describe } from 'vitest'
import { Path } from 'slate'

describe.concurrent('Path', () => {
  test('ancestors-reverse', () => {
    const input = [0, 1, 2]
    const test = path => {
      return Path.ancestors(path, { reverse: true })
    }
    const output = [[0, 1], [0], []]

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('ancestors-success', () => {
    const input = [0, 1, 2]
    const test = path => {
      return Path.ancestors(path)
    }
    const output = [[], [0], [0, 1]]

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('common-equal', () => {
    const input = {
      path: [0, 1, 2],
      another: [0, 1, 2],
    }
    const test = ({ path, another }) => {
      return Path.common(path, another)
    }
    const output = [0, 1, 2]

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('common-root', () => {
    const input = {
      path: [0, 1, 2],
      another: [3, 2],
    }
    const test = ({ path, another }) => {
      return Path.common(path, another)
    }
    const output = []

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('common-success', () => {
    const input = {
      path: [0, 1, 2],
      another: [0, 2],
    }
    const test = ({ path, another }) => {
      return Path.common(path, another)
    }
    const output = [0]

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('compare-above', () => {
    const input = {
      path: [0, 1, 2],
      another: [0],
    }
    const test = ({ path, another }) => {
      return Path.compare(path, another)
    }
    const output = 0

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('compare-after', () => {
    const input = {
      path: [1, 1, 2],
      another: [0],
    }
    const test = ({ path, another }) => {
      return Path.compare(path, another)
    }
    const output = 1

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('compare-before', () => {
    const input = {
      path: [0, 1, 2],
      another: [1],
    }
    const test = ({ path, another }) => {
      return Path.compare(path, another)
    }
    const output = -1

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('compare-below', () => {
    const input = {
      path: [0],
      another: [0, 1],
    }
    const test = ({ path, another }) => {
      return Path.compare(path, another)
    }
    const output = 0

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('compare-equal', () => {
    const input = {
      path: [0, 1, 2],
      another: [0, 1, 2],
    }
    const test = ({ path, another }) => {
      return Path.compare(path, another)
    }
    const output = 0

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('compare-root', () => {
    const input = {
      path: [0, 1, 2],
      another: [],
    }
    const test = ({ path, another }) => {
      return Path.compare(path, another)
    }
    const output = 0

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('endsAfter-above', () => {
    const input = {
      path: [0, 1, 2],
      another: [0],
    }
    const test = ({ path, another }) => {
      return Path.endsAfter(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('endsAfter-after', () => {
    const input = {
      path: [1, 1, 2],
      another: [0],
    }
    const test = ({ path, another }) => {
      return Path.endsAfter(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('endsAfter-before', () => {
    const input = {
      path: [0, 1, 2],
      another: [1],
    }
    const test = ({ path, another }) => {
      return Path.endsAfter(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('endsAfter-below', () => {
    const input = {
      path: [0],
      another: [0, 1],
    }
    const test = ({ path, another }) => {
      return Path.endsAfter(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('endsAfter-ends-after', () => {
    const input = {
      path: [1],
      another: [0, 2],
    }
    const test = ({ path, another }) => {
      return Path.endsAfter(path, another)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('endsAfter-ends-at', () => {
    const input = {
      path: [0],
      another: [0, 2],
    }
    const test = ({ path, another }) => {
      return Path.endsAfter(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('endsAfter-ends-before', () => {
    const input = {
      path: [0],
      another: [1, 2],
    }
    const test = ({ path, another }) => {
      return Path.endsAfter(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('endsAfter-equal', () => {
    const input = {
      path: [0, 1, 2],
      another: [0, 1, 2],
    }
    const test = ({ path, another }) => {
      return Path.endsAfter(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('endsAfter-root', () => {
    const input = {
      path: [0, 1, 2],
      another: [],
    }
    const test = ({ path, another }) => {
      return Path.endsAfter(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('endsAt-above', () => {
    const input = {
      path: [0, 1, 2],
      another: [0],
    }
    const test = ({ path, another }) => {
      return Path.endsAt(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('endsAt-after', () => {
    const input = {
      path: [1, 1, 2],
      another: [0],
    }
    const test = ({ path, another }) => {
      return Path.endsAt(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('endsAt-before', () => {
    const input = {
      path: [0, 1, 2],
      another: [1],
    }
    const test = ({ path, another }) => {
      return Path.endsAt(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('endsAt-ends-after', () => {
    const input = {
      path: [1],
      another: [0, 2],
    }
    const test = ({ path, another }) => {
      return Path.endsAt(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('endsAt-ends-at', () => {
    const input = {
      path: [0],
      another: [0, 2],
    }
    const test = ({ path, another }) => {
      return Path.endsAt(path, another)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('endsAt-ends-before', () => {
    const input = {
      path: [0],
      another: [1, 2],
    }
    const test = ({ path, another }) => {
      return Path.endsAt(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('endsAt-equal', () => {
    const input = {
      path: [0, 1, 2],
      another: [0, 1, 2],
    }
    const test = ({ path, another }) => {
      return Path.endsAt(path, another)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('endsAt-root', () => {
    const input = {
      path: [0, 1, 2],
      another: [],
    }
    const test = ({ path, another }) => {
      return Path.endsAt(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('endsBefore-above', () => {
    const input = {
      path: [0, 1, 2],
      another: [0],
    }
    const test = ({ path, another }) => {
      return Path.endsBefore(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('endsBefore-after', () => {
    const input = {
      path: [1, 1, 2],
      another: [0],
    }
    const test = ({ path, another }) => {
      return Path.endsBefore(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('endsBefore-before', () => {
    const input = {
      path: [0, 1, 2],
      another: [1],
    }
    const test = ({ path, another }) => {
      return Path.endsBefore(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('endsBefore-below', () => {
    const input = {
      path: [0],
      another: [0, 1],
    }
    const test = ({ path, another }) => {
      return Path.endsBefore(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('endsBefore-ends-after', () => {
    const input = {
      path: [1],
      another: [0, 2],
    }
    const test = ({ path, another }) => {
      return Path.endsBefore(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('endsBefore-ends-at', () => {
    const input = {
      path: [0],
      another: [0, 2],
    }
    const test = ({ path, another }) => {
      return Path.endsBefore(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('endsBefore-ends-before', () => {
    const input = {
      path: [0],
      another: [1, 2],
    }
    const test = ({ path, another }) => {
      return Path.endsBefore(path, another)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('endsBefore-equal', () => {
    const input = {
      path: [0, 1, 2],
      another: [0, 1, 2],
    }
    const test = ({ path, another }) => {
      return Path.endsBefore(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('endsBefore-root', () => {
    const input = {
      path: [0, 1, 2],
      another: [],
    }
    const test = ({ path, another }) => {
      return Path.endsBefore(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('equals-above', () => {
    const input = {
      path: [0, 1, 2],
      another: [0],
    }
    const test = ({ path, another }) => {
      return Path.equals(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('equals-after', () => {
    const input = {
      path: [1, 1, 2],
      another: [0],
    }
    const test = ({ path, another }) => {
      return Path.equals(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('equals-before', () => {
    const input = {
      path: [0, 1, 2],
      another: [1],
    }
    const test = ({ path, another }) => {
      return Path.equals(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('equals-below', () => {
    const input = {
      path: [0],
      another: [0, 1],
    }
    const test = ({ path, another }) => {
      return Path.equals(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('equals-equal', () => {
    const input = {
      path: [0, 1, 2],
      another: [0, 1, 2],
    }
    const test = ({ path, another }) => {
      return Path.equals(path, another)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('equals-root', () => {
    const input = {
      path: [0, 1, 2],
      another: [],
    }
    const test = ({ path, another }) => {
      return Path.equals(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('hasPrevious-root', () => {
    const input = [0, 0]
    const test = path => {
      return Path.hasPrevious(path)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('hasPrevious-success', () => {
    const input = [0, 1]
    const test = path => {
      return Path.hasPrevious(path)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isAfter-above', () => {
    const input = {
      path: [0],
      another: [0, 1],
    }
    const test = ({ path, another }) => {
      return Path.isAfter(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isAfter-after', () => {
    const input = {
      path: [1, 1, 2],
      another: [0],
    }
    const test = ({ path, another }) => {
      return Path.isAfter(path, another)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isAfter-before', () => {
    const input = {
      path: [0, 1, 2],
      another: [1],
    }
    const test = ({ path, another }) => {
      return Path.isAfter(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isAfter-below', () => {
    const input = {
      path: [0, 1, 2],
      another: [0],
    }
    const test = ({ path, another }) => {
      return Path.isAfter(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isAfter-equal', () => {
    const input = {
      path: [0, 1, 2],
      another: [0, 1, 2],
    }
    const test = ({ path, another }) => {
      return Path.isAfter(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isAncestor-above-grandparent', () => {
    const input = {
      path: [],
      another: [0, 1],
    }
    const test = ({ path, another }) => {
      return Path.isAncestor(path, another)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isAncestor-above-parent', () => {
    const input = {
      path: [0],
      another: [0, 1],
    }
    const test = ({ path, another }) => {
      return Path.isAncestor(path, another)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isAncestor-after', () => {
    const input = {
      path: [1, 1, 2],
      another: [0],
    }
    const test = ({ path, another }) => {
      return Path.isAncestor(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isAncestor-before', () => {
    const input = {
      path: [0, 1, 2],
      another: [1],
    }
    const test = ({ path, another }) => {
      return Path.isAncestor(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isAncestor-below', () => {
    const input = {
      path: [0, 1, 2],
      another: [0],
    }
    const test = ({ path, another }) => {
      return Path.isAncestor(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isAncestor-equal', () => {
    const input = {
      path: [0, 1, 2],
      another: [0, 1, 2],
    }
    const test = ({ path, another }) => {
      return Path.isAncestor(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isBefore-above', () => {
    const input = {
      path: [0],
      another: [0, 1],
    }
    const test = ({ path, another }) => {
      return Path.isBefore(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isBefore-after', () => {
    const input = {
      path: [1, 1, 2],
      another: [0],
    }
    const test = ({ path, another }) => {
      return Path.isBefore(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isBefore-before', () => {
    const input = {
      path: [0, 1, 2],
      another: [1],
    }
    const test = ({ path, another }) => {
      return Path.isBefore(path, another)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isBefore-below', () => {
    const input = {
      path: [0, 1, 2],
      another: [0],
    }
    const test = ({ path, another }) => {
      return Path.isBefore(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isBefore-equal', () => {
    const input = {
      path: [0, 1, 2],
      another: [0, 1, 2],
    }
    const test = ({ path, another }) => {
      return Path.isBefore(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isChild-above', () => {
    const input = {
      path: [0],
      another: [0, 1],
    }
    const test = ({ path, another }) => {
      return Path.isChild(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isChild-after', () => {
    const input = {
      path: [1, 1, 2],
      another: [0],
    }
    const test = ({ path, another }) => {
      return Path.isChild(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isChild-before', () => {
    const input = {
      path: [0, 1, 2],
      another: [1],
    }
    const test = ({ path, another }) => {
      return Path.isChild(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isChild-below-child', () => {
    const input = {
      path: [0, 1],
      another: [0],
    }
    const test = ({ path, another }) => {
      return Path.isChild(path, another)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isChild-below-grandchild', () => {
    const input = {
      path: [0, 1],
      another: [],
    }
    const test = ({ path, another }) => {
      return Path.isChild(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isChild-equal', () => {
    const input = {
      path: [0, 1, 2],
      another: [0, 1, 2],
    }
    const test = ({ path, another }) => {
      return Path.isChild(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isDescendant-above', () => {
    const input = {
      path: [0],
      another: [0, 1],
    }
    const test = ({ path, another }) => {
      return Path.isDescendant(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isDescendant-after', () => {
    const input = {
      path: [1, 1, 2],
      another: [0],
    }
    const test = ({ path, another }) => {
      return Path.isDescendant(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isDescendant-before', () => {
    const input = {
      path: [0, 1, 2],
      another: [1],
    }
    const test = ({ path, another }) => {
      return Path.isDescendant(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isDescendant-below-child', () => {
    const input = {
      path: [0, 1],
      another: [0],
    }
    const test = ({ path, another }) => {
      return Path.isDescendant(path, another)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isDescendant-below-grandchild', () => {
    const input = {
      path: [0, 1],
      another: [],
    }
    const test = ({ path, another }) => {
      return Path.isDescendant(path, another)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isDescendant-equal', () => {
    const input = {
      path: [0, 1, 2],
      another: [0, 1, 2],
    }
    const test = ({ path, another }) => {
      return Path.isDescendant(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isParent-above-grandparent', () => {
    const input = {
      path: [],
      another: [0, 1],
    }
    const test = ({ path, another }) => {
      return Path.isParent(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isParent-above-parent', () => {
    const input = {
      path: [0],
      another: [0, 1],
    }
    const test = ({ path, another }) => {
      return Path.isParent(path, another)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isParent-after', () => {
    const input = {
      path: [1, 1, 2],
      another: [0],
    }
    const test = ({ path, another }) => {
      return Path.isParent(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isParent-before', () => {
    const input = {
      path: [0, 1, 2],
      another: [1],
    }
    const test = ({ path, another }) => {
      return Path.isParent(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isParent-below', () => {
    const input = {
      path: [0, 1, 2],
      another: [0],
    }
    const test = ({ path, another }) => {
      return Path.isParent(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isParent-equal', () => {
    const input = {
      path: [0, 1, 2],
      another: [0, 1, 2],
    }
    const test = ({ path, another }) => {
      return Path.isParent(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isPath-boolean', () => {
    const input = true
    const test = path => {
      return Path.isPath(path)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isPath-empty', () => {
    const input = []
    const test = path => {
      return Path.isPath(path)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isPath-full', () => {
    const input = [0, 1]
    const test = path => {
      return Path.isPath(path)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isPath-strings', () => {
    const input = ['a', 'b']
    const test = path => {
      return Path.isPath(path)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isSibling-above', () => {
    const input = {
      path: [],
      another: [0, 1],
    }
    const test = ({ path, another }) => {
      return Path.isSibling(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isSibling-after-sibling', () => {
    const input = {
      path: [1, 4],
      another: [1, 2],
    }
    const test = ({ path, another }) => {
      return Path.isSibling(path, another)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isSibling-after', () => {
    const input = {
      path: [1, 2],
      another: [0],
    }
    const test = ({ path, another }) => {
      return Path.isSibling(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isSibling-before-sibling', () => {
    const input = {
      path: [0, 1],
      another: [0, 3],
    }
    const test = ({ path, another }) => {
      return Path.isSibling(path, another)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isSibling-before', () => {
    const input = {
      path: [0, 2],
      another: [1],
    }
    const test = ({ path, another }) => {
      return Path.isSibling(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isSibling-below', () => {
    const input = {
      path: [0, 2],
      another: [0],
    }
    const test = ({ path, another }) => {
      return Path.isSibling(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isSibling-equal', () => {
    const input = {
      path: [0, 1],
      another: [0, 1],
    }
    const test = ({ path, another }) => {
      return Path.isSibling(path, another)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('levels-reverse', () => {
    const input = [0, 1, 2]
    const test = path => {
      return Path.levels(path, { reverse: true })
    }
    const output = [[0, 1, 2], [0, 1], [0], []]

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('levels-success', () => {
    const input = [0, 1, 2]
    const test = path => {
      return Path.levels(path)
    }
    const output = [[], [0], [0, 1], [0, 1, 2]]

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('next-success', () => {
    const input = [0, 1]
    const test = path => {
      return Path.next(path)
    }
    const output = [0, 2]

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('parent-success', () => {
    const input = [0, 1]
    const test = path => {
      return Path.parent(path)
    }
    const output = [0]

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('previous-success', () => {
    const input = [0, 1]
    const test = path => {
      return Path.previous(path)
    }
    const output = [0, 0]

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('relative-grandparent', () => {
    const input = {
      path: [0, 1, 2],
      another: [0],
    }
    const test = ({ path, another }) => {
      return Path.relative(path, another)
    }
    const output = [1, 2]

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('relative-parent', () => {
    const input = {
      path: [0, 1],
      another: [0],
    }
    const test = ({ path, another }) => {
      return Path.relative(path, another)
    }
    const output = [1]

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('relative-root', () => {
    const input = {
      path: [0, 1],
      another: [],
    }
    const test = ({ path, another }) => {
      return Path.relative(path, another)
    }
    const output = [0, 1]

    const result = test(input)
    expect(result).toEqual(output)
  })
})
