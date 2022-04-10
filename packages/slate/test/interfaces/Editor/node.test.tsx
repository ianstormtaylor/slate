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

describe.concurrent('node', () => {
  test('node-path', () => {
    const input = (
      <editor>
        <block>one</block>
      </editor>
    )
    const test = editor => {
      return Editor.node(editor, [0])
    }
    const output = [<block>one</block>, [0]]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('node-point', () => {
    const input = (
      <editor>
        <block>one</block>
      </editor>
    )
    const test = editor => {
      return Editor.node(editor, { path: [0, 0], offset: 1 })
    }
    const output = [<text>one</text>, [0, 0]]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('node-range-end', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const test = editor => {
      return Editor.node(
        editor,
        {
          anchor: { path: [0, 0], offset: 1 },
          focus: { path: [1, 0], offset: 2 },
        },
        { edge: 'end' }
      )
    }
    const output = [<text>two</text>, [1, 0]]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('node-range-start', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const test = editor => {
      return Editor.node(
        editor,
        {
          anchor: { path: [0, 0], offset: 1 },
          focus: { path: [1, 0], offset: 2 },
        },
        { edge: 'start' }
      )
    }
    const output = [<text>one</text>, [0, 0]]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('node-range', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const test = editor => {
      return Editor.node(editor, {
        anchor: { path: [0, 0], offset: 1 },
        focus: { path: [1, 0], offset: 2 },
      })
    }
    const output = [input, []]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })
})
