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

describe.concurrent('unhangRange', () => {
  test('unhangRange-block-hanging-over-void-with-voids-option', () => {
    const input = (
      <editor>
        <block>
          <anchor />
          This is a first paragraph
        </block>
        <block>This is the second paragraph</block>
        <block void />
        <block>
          <focus />
        </block>
      </editor>
    )

    const test = editor => {
      return Editor.unhangRange(editor, editor.selection, { voids: true })
    }

    const output = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [1, 0], offset: 28 },
    }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('unhangRange-block-hanging-over-void', () => {
    const input = (
      <editor>
        <block>
          <anchor />
          This is a first paragraph
        </block>
        <block>This is the second paragraph</block>
        <block void />
        <block>
          <focus />
        </block>
      </editor>
    )

    const test = editor => {
      return Editor.unhangRange(editor, editor.selection)
    }

    const output = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [1, 0], offset: 28 },
    }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('unhangRange-block-hanging', () => {
    const input = (
      <editor>
        <block>
          <anchor />
          word
        </block>
        <block>
          <focus />
          another
        </block>
      </editor>
    )

    const test = editor => {
      return Editor.unhangRange(editor, editor.selection)
    }

    const output = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 4 },
    }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('unhangRange-collapsed', () => {
    const input = (
      <editor>
        <block>
          one
          <cursor />
        </block>
      </editor>
    )
    const test = editor => {
      return Editor.unhangRange(editor, editor.selection)
    }
    const output = {
      anchor: { path: [0, 0], offset: 3 },
      focus: { path: [0, 0], offset: 3 },
    }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('unhangRange-inline-range-normal', () => {
    const input = (
      <editor>
        <block>
          <text>Block before</text>
        </block>
        <block>
          <text>
            <anchor />
            Some text before{' '}
          </text>
          <inline void>
            <focus />
          </inline>
          <text />
        </block>
        <block>
          <text>Another block</text>
        </block>
      </editor>
    )

    const test = editor => {
      const range = Editor.unhangRange(editor, editor.selection)
      return range
    }

    const output = {
      anchor: { path: [1, 0], offset: 0 },
      focus: { path: [1, 1, 0], offset: 0 },
    }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('unhangRange-text-hanging', () => {
    const input = (
      <editor>
        <block>
          <text>
            before
            <anchor />
          </text>
          <text>selected</text>
          <text>
            <focus />
            after
          </text>
        </block>
      </editor>
    )

    const test = editor => {
      return Editor.unhangRange(editor, editor.selection)
    }

    const output = {
      anchor: { path: [0, 0], offset: 6 },
      focus: { path: [0, 2], offset: 0 },
    }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('unhangRange-void-hanging-with-voids-option', () => {
    const input = (
      <editor>
        <block>
          <anchor />
          This is a first paragraph
        </block>
        <block>This is the second paragraph</block>
        <block void>
          <focus />
        </block>
      </editor>
    )

    const test = editor => {
      return Editor.unhangRange(editor, editor.selection, { voids: true })
    }

    const output = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [1, 0], offset: 28 },
    }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('unhangRange-void-hanging', () => {
    const input = (
      <editor>
        <block>
          <anchor />
          This is a first paragraph
        </block>
        <block>This is the second paragraph</block>
        <block void>
          <focus />
        </block>
      </editor>
    )

    const test = editor => {
      return Editor.unhangRange(editor, editor.selection)
    }

    const output = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 25 },
    }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })
})
