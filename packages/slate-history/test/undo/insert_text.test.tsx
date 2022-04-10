/** @jsx jsx */

import { test, expect, describe } from 'vitest'
import { jsx } from '../jsx'
import { cloneDeep } from 'lodash'
import { Transforms } from 'slate'
import { withHistory } from 'slate-history'
import { withTest } from '../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('insert_text', () => {
  test('insert_text-basic', () => {
    const run = editor => {
      editor.insertText('text')
    }
    const input = (
      <editor>
        <block>
          one
          <cursor />
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

  test('insert_text-contiguous', () => {
    const run = editor => {
      editor.insertText('t')
      editor.insertText('w')
      editor.insertText('o')
    }
    const input = (
      <editor>
        <block>
          one
          <cursor />
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

  test.skip('insert_text-non-contiguous', () => {
    const run = editor => {
      editor.insertText('t')
      Transforms.move(editor, { reverse: true })
      editor.insertText('w')
      Transforms.move(editor, { reverse: true })
      editor.insertText('o')
    }
    const input = (
      <editor>
        <block>
          one
          <cursor />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          onew
          <cursor />t
        </block>
      </editor>
    )

    const editor = withTest(withHistory(input))
    run(editor)
    editor.undo()
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })
})
