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

describe.concurrent('hasTexts', () => {
  test('hasTexts-block-nested', () => {
    const input = (
      <editor>
        <block>
          <block>one</block>
        </block>
      </editor>
    )
    const test = editor => {
      const block = editor.children[0]
      return Editor.hasTexts(editor, block)
    }
    const output = false

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('hasTexts-block', () => {
    const input = (
      <editor>
        <block>one</block>
      </editor>
    )
    const test = editor => {
      const block = editor.children[0]
      return Editor.hasTexts(editor, block)
    }
    const output = true

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('hasTexts-inline-nested', () => {
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
      return Editor.hasTexts(editor, inline)
    }
    const output = false

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('hasTexts-inline', () => {
    const input = (
      <editor>
        <block>
          one<inline>two</inline>three
        </block>
      </editor>
    )
    const test = editor => {
      const inline = editor.children[0].children[1]
      return Editor.hasTexts(editor, inline)
    }
    const output = true

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })
})
