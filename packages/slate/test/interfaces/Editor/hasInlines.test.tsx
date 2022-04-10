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

describe.concurrent('hasInlines', () => {
  test('hasInlines-block-nested', () => {
    const input = (
      <editor>
        <block>
          <block>one</block>
        </block>
      </editor>
    )
    const test = editor => {
      const block = editor.children[0]
      return Editor.hasInlines(editor, block)
    }
    const output = false

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('hasInlines-block', () => {
    const input = (
      <editor>
        <block>one</block>
      </editor>
    )
    const test = editor => {
      const block = editor.children[0]
      return Editor.hasInlines(editor, block)
    }
    const output = true

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('hasInlines-inline-nested', () => {
    const input = (
      <editor>
        <block>
          one
          <inline>
            two<inline>three</inline>four
          </inline>
          five
        </block>
      </editor>
    )
    const test = editor => {
      const inline = editor.children[0].children[1]
      return Editor.hasInlines(editor, inline)
    }
    const output = true

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('hasInlines-inline', () => {
    const input = (
      <editor>
        <block>
          one<inline>two</inline>three
        </block>
      </editor>
    )
    const test = editor => {
      const block = editor.children[0]
      return Editor.hasInlines(editor, block)
    }
    const output = true

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })
})
