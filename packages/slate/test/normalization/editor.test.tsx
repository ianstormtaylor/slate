/** @jsx jsx */
import { Editor } from 'slate'
import { test, expect, describe } from 'vitest'
import { jsx } from '../jsx'
import { withTest } from '../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('editor', () => {
  test('editor-remove-inline', () => {
    const input = (
      <editor>
        <inline>one</inline>
        <block>two</block>
      </editor>
    )
    const output = (
      <editor>
        <block>two</block>
      </editor>
    )

    const editor = withTest(input)
    Editor.normalize(editor, { force: true })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('editor-remove-text', () => {
    const input = (
      <editor>
        <text>one</text>
        <block>two</block>
      </editor>
    )
    const output = (
      <editor>
        <block>two</block>
      </editor>
    )

    const editor = withTest(input)
    Editor.normalize(editor, { force: true })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })
})
