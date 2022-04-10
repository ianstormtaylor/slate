/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../jsx'
import { withTest } from '../../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('isStart', () => {
  test('isStart-path-end', () => {
    const input = (
      <editor>
        <block>
          one
          <cursor />
        </block>
      </editor>
    )
    const test = editor => {
      const { anchor } = editor.selection
      return Editor.isStart(editor, anchor, [0])
    }
    const output = false

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('isStart-path-middle', () => {
    const input = (
      <editor>
        <block>
          on
          <cursor />e
        </block>
      </editor>
    )
    const test = editor => {
      const { anchor } = editor.selection
      return Editor.isStart(editor, anchor, [0])
    }
    const output = false

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('isStart-path-start', () => {
    const input = (
      <editor>
        <block>
          <cursor />
          one
        </block>
      </editor>
    )
    const test = editor => {
      const { anchor } = editor.selection
      return Editor.isStart(editor, anchor, [0])
    }
    const output = true

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })
})
