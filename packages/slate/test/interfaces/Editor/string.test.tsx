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

describe.concurrent('string', () => {
  test('string-block-across', () => {
    const input = (
      <editor>
        <block>
          <text>one</text>
          <text>two</text>
        </block>
        <block>
          <text>three</text>
          <text>four</text>
        </block>
      </editor>
    )
    const test = editor => {
      return Editor.string(editor, [])
    }
    const output = `onetwothreefour`

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('string-block-void', () => {
    const input = (
      <editor>
        <block void>
          <text>one</text>
          <text>two</text>
        </block>
      </editor>
    )
    const test = editor => {
      return Editor.string(editor, [0])
    }
    const output = ``

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('string-block-voids-true', () => {
    const input = (
      <editor>
        <block void>
          <text>one</text>
          <text>two</text>
        </block>
      </editor>
    )
    const test = editor => {
      return Editor.string(editor, [0], { voids: true })
    }
    const output = `onetwo`

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('string-block', () => {
    const input = (
      <editor>
        <block>
          <text>one</text>
          <text>two</text>
        </block>
        <block>
          <text>three</text>
          <text>four</text>
        </block>
      </editor>
    )
    const test = editor => {
      return Editor.string(editor, [0])
    }
    const output = `onetwo`

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('string-inline', () => {
    const input = (
      <editor>
        <block>
          one<inline>two</inline>three
        </block>
      </editor>
    )
    const test = editor => {
      return Editor.string(editor, [0, 1])
    }
    const output = `two`

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('string-text', () => {
    const input = (
      <editor>
        <block>
          <text>one</text>
          <text>two</text>
        </block>
      </editor>
    )
    const test = editor => {
      return Editor.string(editor, [0, 0])
    }
    const output = `one`

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })
})
