/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import assert from 'assert'
import { Transforms } from 'slate'
import { jsx } from '../jsx'
import { withTest } from '../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('general', () => {
  test('general-invalid-insert_node', () => {
    const input = (
      <editor>
        <block>
          word
          <cursor />
        </block>
      </editor>
    )
    const run = editor => {
      // position 2 is past the end of the block children
      assert.throws(() => {
        Transforms.insertNodes(editor, <text>another</text>, { at: [0, 2] })
      }, 'Inserting a node after the end of a block should fail')
      // 1 is _at_ the end, so it's still valid
      Transforms.insertNodes(editor, <text>another</text>, { at: [0, 1] })
    }
    const output = (
      <editor>
        <block>
          word
          <cursor />
          another
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })
})
