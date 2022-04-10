/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../jsx'
import { withTest } from '../../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('parent', () => {
  test('parent-path', () => {
    const input = (
      <editor>
        <block>one</block>
      </editor>
    )
    const test = editor => {
      return Editor.parent(editor, [0, 0])
    }
    const output = [<block>one</block>, [0]]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('parent-point', () => {
    const input = (
      <editor>
        <block>one</block>
      </editor>
    )
    const test = editor => {
      return Editor.parent(editor, { path: [0, 0], offset: 1 })
    }
    const output = [<block>one</block>, [0]]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('parent-range-end', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const test = editor => {
      return Editor.parent(
        editor,
        {
          anchor: { path: [0, 0], offset: 1 },
          focus: { path: [1, 0], offset: 2 },
        },
        { edge: 'end' }
      )
    }
    const output = [<block>two</block>, [1]]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('parent-range-start', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const test = editor => {
      return Editor.parent(
        editor,
        {
          anchor: { path: [0, 0], offset: 1 },
          focus: { path: [1, 0], offset: 2 },
        },
        { edge: 'start' }
      )
    }
    const output = [<block>one</block>, [0]]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('parent-range', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const test = editor => {
      return Editor.parent(editor, {
        anchor: { path: [0, 0], offset: 1 },
        focus: { path: [0, 0], offset: 2 },
      })
    }
    const output = [<block>one</block>, [0]]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })
})
