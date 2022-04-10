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

describe.concurrent('remove_node', () => {
  test('remove_node-cursor-nested', () => {
    const input = (
      <editor>
        <element>
          <text />
        </element>
        <element>
          <element>
            <cursor />
            <text />
          </element>
        </element>
      </editor>
    )
    const operations = [
      {
        type: 'remove_node',
        path: [1, 0, 0],
        node: { text: '' },
      },
    ]
    const output = (
      <editor>
        <element>
          <text />
        </element>
        <element>
          <element>
            <cursor />
          </element>
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

  test('remove_node-cursor', () => {
    const input = (
      <editor>
        <element>
          <text />
        </element>
        <element>
          <cursor />
          <text />
        </element>
      </editor>
    )
    const operations = [
      {
        type: 'remove_node',
        path: [1, 0],
        node: { text: '' },
      },
    ]
    const output = (
      <editor>
        <element>
          <text />
        </element>
        <element>
          <cursor />
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
