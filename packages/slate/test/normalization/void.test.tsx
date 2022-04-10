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

describe.concurrent('void', () => {
  test('void-block-insert-text', () => {
    const input = (
      <editor>
        <block void />
      </editor>
    )
    const output = (
      <editor>
        <block void>
          <text />
        </block>
      </editor>
    )

    const editor = withTest(input)
    Editor.normalize(editor, { force: true })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('void-inline-insert-text', () => {
    const input = (
      <editor>
        <block>
          <text />
          <inline void />
          <text />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text />
          <inline void>
            <text />
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
