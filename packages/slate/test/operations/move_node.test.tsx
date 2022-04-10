/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { jsx } from 'slate-hyperscript'
import { withTest } from '../with-test'
import { Editor } from 'slate'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('move_node', () => {
  test('move_node-path-equals-new-path', () => {
    const input = (
      <editor>
        <element>1</element>
        <element>2</element>
      </editor>
    )
    const operations = [
      {
        type: 'move_node',
        path: [0],
        newPath: [0],
      },
    ]
    const output = (
      <editor>
        <element>1</element>
        <element>2</element>
      </editor>
    )

    const editor = withTest(input)
    Editor.withoutNormalizing(editor, () => {
      for (const op of operations) {
        editor.apply(op)
      }
    })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move_node-path-not-equals-new-path', () => {
    const input = (
      <editor>
        <element>1</element>
        <element>2</element>
      </editor>
    )
    const operations = [
      {
        type: 'move_node',
        path: [0],
        newPath: [1],
      },
    ]
    const output = (
      <editor>
        <element>2</element>
        <element>1</element>
      </editor>
    )

    const editor = withTest(input)
    Editor.withoutNormalizing(editor, () => {
      for (const op of operations) {
        editor.apply(op)
      }
    })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })
})
