/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { jsx } from '../jsx'
import { Transforms } from 'slate'
import { cloneDeep } from 'lodash'
import { withHistory } from 'slate-history'
import { withTest } from '../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('delete_backward', () => {
  test('delete_backward-block-join-reverse', () => {
    const run = editor => {
      editor.deleteBackward()
    }
    const input = (
      <editor>
        <block>Hello</block>
        <block>
          <cursor />
          world!
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>Hello</block>
        <block>
          <cursor />
          world!
        </block>
      </editor>
    )

    const editor = withTest(withHistory(input))
    run(editor)
    editor.undo()
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete_backward-block-nested-reverse', () => {
    const run = editor => {
      editor.deleteBackward()
    }
    const input = (
      <editor>
        <block>Hello</block>
        <block>
          <block>
            <cursor />
            world!
          </block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>Hello</block>
        <block>
          <block>
            <cursor />
            world!
          </block>
        </block>
      </editor>
    )

    const editor = withTest(withHistory(input))
    run(editor)
    editor.undo()
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  // TODO: see https://github.com/ianstormtaylor/slate/pull/4188
  test.skip('delete_backward-block-text', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          wo
          <cursor />
          rd
        </block>
      </editor>
    )
    const output = cloneDeep(input)

    const editor = withTest(withHistory(input))
    run(editor)
    editor.undo()
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  // TODO: see https://github.com/ianstormtaylor/slate/pull/4188
  test.skip('delete_backward-custom-prop', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block a>
          o<anchor />
          ne
        </block>
        <block b>
          tw
          <focus />o
        </block>
      </editor>
    )
    const output = cloneDeep(input)

    const editor = withTest(withHistory(input))
    run(editor)
    editor.undo()
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  // TODO: see https://github.com/ianstormtaylor/slate/pull/4188
  test.skip('delete_backward-inline-across', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline a>
            o<anchor />
            ne
          </inline>
          <text />
        </block>
        <block>
          <text />
          <inline b>
            tw
            <focus />o
          </inline>
          <text />
        </block>
      </editor>
    )
    const output = cloneDeep(input)

    const editor = withTest(withHistory(input))
    run(editor)
    editor.undo()
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })
})
