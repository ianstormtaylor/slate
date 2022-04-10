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

describe.concurrent('isEmpty', () => {
  test('isEmpty-block-blank', () => {
    const input = (
      <editor>
        <block>
          <text />
        </block>
      </editor>
    )
    const test = editor => {
      const block = editor.children[0]
      return Editor.isEmpty(editor, block)
    }
    const output = true

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('isEmpty-block-empty', () => {
    const input = (
      <editor>
        <block />
      </editor>
    )
    const test = editor => {
      const block = editor.children[0]
      return Editor.isEmpty(editor, block)
    }
    const output = true

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('isEmpty-block-full', () => {
    const input = (
      <editor>
        <block>one</block>
      </editor>
    )
    const test = editor => {
      const block = editor.children[0]
      return Editor.isEmpty(editor, block)
    }
    const output = false

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('isEmpty-block-void', () => {
    const input = (
      <editor>
        <block void>
          <text />
        </block>
      </editor>
    )
    const test = editor => {
      const block = editor.children[0]
      return Editor.isEmpty(editor, block)
    }
    const output = false

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('isEmpty-inline-blank', () => {
    const input = (
      <editor>
        <block>
          one
          <inline>
            <text />
          </inline>
          three
        </block>
      </editor>
    )
    const test = editor => {
      const inline = editor.children[0].children[1]
      return Editor.isEmpty(editor, inline)
    }
    const output = true

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('isEmpty-inline-empty', () => {
    const input = (
      <editor>
        <block>
          one
          <inline />
          three
        </block>
      </editor>
    )
    const test = editor => {
      const inline = editor.children[0].children[1]
      return Editor.isEmpty(editor, inline)
    }
    const output = true

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('isEmpty-inline-full', () => {
    const input = (
      <editor>
        <block>
          one<inline>two</inline>three
        </block>
      </editor>
    )
    const test = editor => {
      const inline = editor.children[0].children[1]
      return Editor.isEmpty(editor, inline)
    }
    const output = false

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('isEmpty-inline-void', () => {
    const input = (
      <editor>
        <block>
          one
          <inline void>
            <text />
          </inline>
          three
        </block>
      </editor>
    )
    const test = editor => {
      const inline = editor.children[0].children[1]
      return Editor.isEmpty(editor, inline)
    }
    const output = false

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })
})
