/** @jsx jsx */
import { test, expect, describe } from 'vitest'
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

describe.concurrent('insert_fragment', () => {
  test.skip('insert_fragment-basic', () => {
    const fragment = (
      <block type="d">
        <block>A</block>
        <block type="c">
          <block type="d">
            <block>B</block>
            <block>
              <block type="d">
                <block>C</block>
              </block>
            </block>
          </block>
          <block type="d">
            <block>D</block>
          </block>
        </block>
      </block>
    )
    const run = editor => {
      editor.insertFragment(fragment)
    }
    const input = (
      <editor>
        <block type="d">
          <block>
            <text>
              <cursor />
            </text>
          </block>
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
