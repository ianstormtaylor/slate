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

describe.concurrent('next', () => {
  test('next-block', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const test = editor => {
      return Editor.next(editor, {
        at: [0],
        match: n => Editor.isBlock(editor, n),
      })
    }
    const output = [<block>two</block>, [1]]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('next-default', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const test = editor => {
      return Editor.next(editor, { at: [0] })
    }
    const output = [<block>two</block>, [1]]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('next-text', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const test = editor => {
      return Editor.next(editor, { at: [0], match: Text.isText })
    }
    const output = [<text>two</text>, [1, 0]]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })
})
