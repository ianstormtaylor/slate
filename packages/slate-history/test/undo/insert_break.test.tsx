/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../jsx'
import { cloneDeep } from 'lodash'
import { withHistory } from 'slate-history'
import { withTest } from '../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('insert_break', () => {
  test('insert_break-basic', () => {
    const run = editor => {
      editor.insertBreak()
    }
    const input = (
      <editor>
        <block>
          <block>
            on
            <cursor />e
          </block>
          <block>two</block>
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
