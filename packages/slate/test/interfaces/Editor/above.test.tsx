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

describe.concurrent('above', () => {
  test('above-block-highest', () => {
    const input = (
      <editor>
        <block>
          <block>one</block>
        </block>
      </editor>
    )
    const test = editor => {
      return Editor.above(editor, {
        at: [0, 0, 0],
        match: n => Editor.isBlock(editor, n),
        mode: 'highest',
      })
    }
    const output = [
      <block>
        <block>one</block>
      </block>,
      [0],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('above-block-lowest', () => {
    const input = (
      <editor>
        <block>
          <block>one </block>
        </block>
      </editor>
    )

    const test = editor => {
      return Editor.above(editor, {
        at: [0, 0, 0],
        match: n => Editor.isBlock(editor, n),
        mode: 'lowest',
      })
    }

    const output = [<block>one </block>, [0, 0]]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('above-inline', () => {
    const input = (
      <editor>
        <block>
          one<inline>two</inline>three
        </block>
      </editor>
    )

    const test = editor => {
      return Editor.above(editor, {
        at: [0, 1, 0],
        match: n => Editor.isInline(editor, n),
      })
    }

    const output = [<inline>two</inline>, [0, 1]]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })
})
