import { test, expect, describe } from 'vitest'
import { Operation } from 'slate'

describe.concurrent('Operation', () => {
  test('inverse-moveNode-backward-in-parent', () => {
    const input = { type: 'move_node', path: [0, 2], newPath: [0, 1] }
    const test = value => {
      return Operation.inverse(value)
    }
    const output = { type: 'move_node', path: [0, 1], newPath: [0, 2] }

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('inverse-moveNode-child-to-ends-after-parent', () => {
    const input = { type: 'move_node', path: [0, 2, 1], newPath: [0, 3] }
    const test = value => {
      return Operation.inverse(value)
    }
    const output = { type: 'move_node', path: [0, 3], newPath: [0, 2, 1] }

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('inverse-moveNode-child-to-ends-before-parent', () => {
    const input = { type: 'move_node', path: [0, 2, 1], newPath: [0, 1] }
    const test = value => {
      return Operation.inverse(value)
    }
    const output = { type: 'move_node', path: [0, 1], newPath: [0, 3, 1] }

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('inverse-moveNode-child-to-parent', () => {
    // This test covers moving a child to the location of where the current parent is (not becoming its parent).
    // When the move happens the child is inserted infront of its old parent causing its former parent's index to shiftp
    // back within its former grandparent (now parent).
    const input = { type: 'move_node', path: [0, 2, 1], newPath: [0, 2] }
    const test = value => {
      return Operation.inverse(value)
    }
    const output = { type: 'move_node', path: [0, 2], newPath: [0, 3, 1] }

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('inverse-moveNode-ends-after-parent-to-child', () => {
    const input = { type: 'move_node', path: [0, 3], newPath: [0, 2, 1] }
    const test = value => {
      return Operation.inverse(value)
    }
    const output = { type: 'move_node', path: [0, 2, 1], newPath: [0, 3] }

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('inverse-moveNode-ends-before-parent-to-child', () => {
    const input = { type: 'move_node', path: [0, 1], newPath: [0, 2, 1] }
    const test = value => {
      return Operation.inverse(value)
    }
    // The path has changed here because the removal of [0, 1] caused [0, 2] to shift forward into its location.
    const output = { type: 'move_node', path: [0, 1, 1], newPath: [0, 1] }

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('inverse-moveNode-forward-in-parent', () => {
    const input = { type: 'move_node', path: [0, 1], newPath: [0, 2] }
    const test = value => {
      return Operation.inverse(value)
    }
    const output = { type: 'move_node', path: [0, 2], newPath: [0, 1] }

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('inverse-moveNode-non-sibling', () => {
    const input = { type: 'move_node', path: [0, 2], newPath: [1, 0, 0] }
    const test = value => {
      return Operation.inverse(value)
    }
    const output = { type: 'move_node', path: [1, 0, 0], newPath: [0, 2] }

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isOperation-boolean', () => {
    const input = true
    const test = value => {
      return Operation.isOperation(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isOperation-custom-property', () => {
    const input = {
      type: 'set_node',
      path: [0],
      properties: {},
      newProperties: {},
      custom: true,
    }
    const test = value => {
      return Operation.isOperation(value)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isOperation-insert_node', () => {
    const input = {
      type: 'insert_node',
      path: [0],
      node: {
        children: [],
      },
    }
    const test = value => {
      return Operation.isOperation(value)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isOperation-insert_text', () => {
    const input = {
      type: 'insert_text',
      path: [0],
      offset: 0,
      text: 'string',
    }
    const test = value => {
      return Operation.isOperation(value)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isOperation-merge_node', () => {
    const input = {
      type: 'merge_node',
      path: [0],
      position: 0,
      properties: {},
    }
    const test = value => {
      return Operation.isOperation(value)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isOperation-move_node', () => {
    const input = {
      type: 'move_node',
      path: [0],
      newPath: [1],
    }
    const test = value => {
      return Operation.isOperation(value)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isOperation-object', () => {
    const input = {}
    const test = value => {
      return Operation.isOperation(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isOperation-remove_node', () => {
    const input = {
      type: 'remove_node',
      path: [0],
      node: {
        children: [],
      },
    }
    const test = value => {
      return Operation.isOperation(value)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isOperation-remove_text', () => {
    const input = {
      type: 'remove_text',
      path: [0],
      offset: 0,
      text: 'string',
    }
    const test = value => {
      return Operation.isOperation(value)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isOperation-set_node', () => {
    const input = {
      type: 'set_node',
      path: [0],
      properties: {},
      newProperties: {},
    }
    const test = value => {
      return Operation.isOperation(value)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isOperation-set_selection', () => {
    const input = {
      type: 'set_selection',
      properties: {},
      newProperties: {},
    }
    const test = value => {
      return Operation.isOperation(value)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isOperation-split_node', () => {
    const input = {
      type: 'split_node',
      path: [0],
      position: 0,
      properties: {},
    }
    const test = value => {
      return Operation.isOperation(value)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isOperation-without-type', () => {
    const input = {
      path: [0],
      properties: {},
      newProperties: {},
    }
    const test = value => {
      return Operation.isOperation(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isOperationList-boolean', () => {
    const input = true
    const test = value => {
      return Operation.isOperationList(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isOperationList-empty', () => {
    const input = []
    const test = value => {
      return Operation.isOperationList(value)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isOperationList-full', () => {
    const input = [
      {
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: {},
      },
    ]
    const test = value => {
      return Operation.isOperationList(value)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isOperationList-not-full-operaion', () => {
    const input = [
      {
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: {},
      },
      {
        text: '',
      },
    ]
    const test = value => {
      return Operation.isOperationList(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isOperationList-operation', () => {
    const input = {
      type: 'set_node',
      path: [0],
      properties: {},
      newProperties: {},
    }
    const test = value => {
      return Operation.isOperationList(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })
})
