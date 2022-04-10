/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { jsx } from '../jsx'
import { Editor } from 'slate'
import { withTest } from '../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('split_node', () => {
  test('split_node-element-empty-properties', () => {
    const input = (
      <editor>
        <element data>
          before text
          <inline>hyperlink</inline>
          after text
        </element>
      </editor>
    )
    const operations = [
      {
        type: 'split_node',
        path: [0],
        position: 1,
        properties: {},
      },
    ]
    const output = (
      <editor>
        <element data>before text</element>
        <element>
          <text />
          <inline>hyperlink</inline>
          after text
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

  test('split_node-element', () => {
    const input = (
      <editor>
        <element data>
          before text
          <inline>hyperlink</inline>
          after text
        </element>
      </editor>
    )
    const operations = [
      {
        type: 'split_node',
        path: [0],
        position: 1,
        properties: {
          data: true,
        },
      },
    ]
    const output = (
      <editor>
        <element data>before text</element>
        <element data>
          <text />
          <inline>hyperlink</inline>
          after text
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

  test('split_node-text-empty-properties', () => {
    const input = (
      <editor>
        <element>
          <text bold>some text</text>
        </element>
      </editor>
    )
    const operations = [
      {
        type: 'split_node',
        path: [0, 0],
        position: 5,
        properties: {},
      },
    ]
    const output = (
      <editor>
        <element>
          <text bold>some </text>
          <text>text</text>
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

  test('split_node-text', () => {
    const input = (
      <editor>
        <element>
          <text bold>some text</text>
        </element>
      </editor>
    )
    const operations = [
      {
        type: 'split_node',
        path: [0, 0],
        position: 5,
        properties: {
          bold: true,
        },
      },
      {
        type: 'split_node',
        path: [0],
        position: 1,
        properties: {},
      },
    ]
    const output = (
      <editor>
        <element>
          <text bold>some </text>
        </element>
        <element>
          <text bold>text</text>
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
