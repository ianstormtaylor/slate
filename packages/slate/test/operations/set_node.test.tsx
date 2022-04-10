/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { jsx } from 'slate-hyperscript'
import { Editor } from 'slate'
import { withTest } from '../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('set_node', () => {
  test('set_node-remove-null', () => {
    const input = (
      <editor>
        <element>
          <text someKey />
        </element>
      </editor>
    )

    // this is supported for backwards compatibility only; newProperties should omit removed values.
    const operations = [
      {
        type: 'set_node',
        path: [0, 0],
        properties: { someKey: true },
        newProperties: { someKey: null },
      },
    ]

    const output = (
      <editor>
        <element>
          <text />
        </element>
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

  test('set_node-remove-omit', () => {
    const input = (
      <editor>
        <element>
          <text someKey />
        </element>
      </editor>
    )

    const operations = [
      {
        type: 'set_node',
        path: [0, 0],
        properties: { someKey: true },
        newProperties: {},
      },
    ]

    const output = (
      <editor>
        <element>
          <text />
        </element>
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

  test('set_node-remove-undefined', () => {
    const input = (
      <editor>
        <element>
          <text someKey />
        </element>
      </editor>
    )

    // this is supported for backwards compatibility only; newProperties should omit removed values.
    const operations = [
      {
        type: 'set_node',
        path: [0, 0],
        properties: { someKey: true },
        newProperties: { someKey: undefined },
      },
    ]

    const output = (
      <editor>
        <element>
          <text />
        </element>
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
