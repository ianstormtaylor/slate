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

describe.concurrent('after', () => {
  test('after-end', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )

    const test = editor => {
      return Editor.after(editor, [1, 0])
    }

    const output = undefined

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('after-path-void', () => {
    const input = (
      <editor>
        <block void>
          <text>one</text>
          <text>two</text>
        </block>
      </editor>
    )

    const test = editor => {
      return Editor.after(editor, [0, 0], { voids: true })
    }

    const output = { path: [0, 1], offset: 0 }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('after-path', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )

    const test = editor => {
      return Editor.after(editor, [0, 0])
    }

    const output = { path: [1, 0], offset: 0 }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('after-point-void', () => {
    const input = (
      <editor>
        <block void>one</block>
      </editor>
    )

    const test = editor => {
      return Editor.after(editor, { path: [0, 0], offset: 1 }, { voids: true })
    }

    const output = { path: [0, 0], offset: 2 }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('after-point', () => {
    const input = (
      <editor>
        <block>one</block>
      </editor>
    )

    const test = editor => {
      return Editor.after(editor, { path: [0, 0], offset: 1 })
    }

    const output = { path: [0, 0], offset: 2 }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('after-range-void', () => {
    const input = (
      <editor>
        <block void>one</block>
        <block void>two</block>
      </editor>
    )

    const test = editor => {
      return Editor.after(
        editor,
        {
          anchor: { path: [0, 0], offset: 1 },
          focus: { path: [1, 0], offset: 2 },
        },
        { voids: true }
      )
    }

    const output = { path: [1, 0], offset: 3 }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('after-range', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )

    const test = editor => {
      return Editor.after(editor, {
        anchor: { path: [0, 0], offset: 1 },
        focus: { path: [1, 0], offset: 2 },
      })
    }

    const output = { path: [1, 0], offset: 3 }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })
})
