/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { Transforms } from 'slate'
import { jsx } from '../jsx'
import { withTest } from '../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('deselect', () => {
  test('deselect-basic', () => {
    const run = editor => {
      Transforms.deselect(editor)
    }
    const input = (
      <editor>
        <block>
          <cursor />
          one
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>one</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })
})
