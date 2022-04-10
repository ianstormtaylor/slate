/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { jsx } from 'slate-hyperscript'
import { Transforms, Editor } from 'slate'
import { withTest } from '../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}
describe.concurrent('set_selection', () => {
  test('set_selection-custom-props', () => {
    const input = (
      <editor>
        <element>
          a<cursor />
        </element>
      </editor>
    )

    const operations = [
      {
        type: 'set_selection',
        oldProperties: {},
        newProperties: { custom: 123 },
      },
    ]

    const output = (
      <editor>
        <element>
          a<cursor />
        </element>
      </editor>
    )

    Transforms.setSelection(output, { custom: 123 })

    const editor = withTest(input)
    Editor.withoutNormalizing(editor, () => {
      for (const op of operations) {
        editor.apply(op)
      }
    })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('set_selection-remove', () => {
    const input = (
      <editor>
        <element>
          a<cursor />
        </element>
      </editor>
    )

    Transforms.setSelection(input, { custom: 123 })

    const operations = [
      {
        type: 'set_selection',
        oldProperties: {},
        newProperties: { custom: null },
      },
    ]

    const output = (
      <editor>
        <element>
          a<cursor />
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
