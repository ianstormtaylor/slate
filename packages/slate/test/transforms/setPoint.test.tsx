/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { Editor, Transforms } from 'slate'
import { jsx } from '../jsx'
import { withTest } from '../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('setPoint', () => {
  test('setPoint-offset', () => {
    const run = editor => {
      Transforms.move(editor)
      Transforms.setPoint(editor, { offset: 0 }, { edge: 'focus' })
    }
    const input = (
      <editor>
        <block>
          f<cursor />
          oo
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <focus />
          fo
          <anchor />o
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })
})
