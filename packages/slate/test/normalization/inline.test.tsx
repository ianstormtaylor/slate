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

describe.concurrent('inline', () => {
  test('inline-insert-adjacent-text', () => {
    const input = (
      <editor>
        <block>
          <inline>one</inline>
          <inline>two</inline>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text />
          <inline>one</inline>
          <text />
          <inline>two</inline>
          <text />
        </block>
      </editor>
    )

    const editor = withTest(input)
    Editor.normalize(editor, { force: true })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('inline-remove-block', () => {
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            <block>one</block>
            <text>two</text>
          </inline>
          <text />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text />
          <inline>
            <text>two</text>
          </inline>
          <text />
        </block>
      </editor>
    )

    const editor = withTest(input)
    Editor.normalize(editor, { force: true })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })
})
