/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { jsx } from '../../jsx'
import { Editor, Text } from 'slate'
import { withTest } from '../../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('previous', () => {
  test('previous-block', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const test = editor => {
      return Editor.previous(editor, {
        at: [1],
        match: n => Editor.isBlock(editor, n),
      })
    }
    const output = [<block>one</block>, [0]]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('previous-default', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const test = editor => {
      return Editor.previous(editor, { at: [1] })
    }
    const output = [<block>one</block>, [0]]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('previous-text', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const test = editor => {
      return Editor.previous(editor, { at: [1], match: Text.isText })
    }
    const output = [<text>one</text>, [0, 0]]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })
})
