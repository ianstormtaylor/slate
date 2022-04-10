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

describe.concurrent('text', () => {
  test('text-merge-adjacent-empty-after-nested', () => {
    const input = (
      <editor>
        <block>
          <text />
        </block>
        <block>
          <block>
            <cursor />
            <text />
          </block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text />
        </block>
        <block>
          <block>
            <cursor />
          </block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    Editor.normalize(editor, { force: true })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('text-merge-adjacent-empty-after', () => {
    const input = (
      <editor>
        <block>
          <text />
        </block>
        <block>
          <cursor />
          <text />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text />
        </block>
        <block>
          <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    Editor.normalize(editor, { force: true })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('text-merge-adjacent-empty-before-inline', () => {
    const input = (
      <editor>
        <block>
          <text>not empty</text>
          <text a />
          <inline>inline</inline>
          <text />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text>not empty</text>
          <inline>inline</inline>
          <text />
        </block>
      </editor>
    )

    const editor = withTest(input)
    Editor.normalize(editor, { force: true })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('text-merge-adjacent-empty', () => {
    const input = (
      <editor>
        <block>
          <text />
          <text />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text />
        </block>
      </editor>
    )

    const editor = withTest(input)
    Editor.normalize(editor, { force: true })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('text-merge-adjacent-match-empty', () => {
    const input = (
      <editor>
        <block>
          <text>1</text>
          <text>2</text>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text>12</text>
        </block>
      </editor>
    )

    const editor = withTest(input)
    Editor.normalize(editor, { force: true })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('text-merge-adjacent-match', () => {
    const input = (
      <editor>
        <block>
          <text a>1</text>
          <text a>2</text>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text a>12</text>
        </block>
      </editor>
    )

    const editor = withTest(input)
    Editor.normalize(editor, { force: true })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })
})
