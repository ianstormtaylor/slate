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

describe.concurrent('path', () => {
  test('path-path', () => {
    const input = (
      <editor>
        <block>one</block>
      </editor>
    )
    const test = editor => {
      return Editor.path(editor, [0])
    }
    const output = [0]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('path-point', () => {
    const input = (
      <editor>
        <block>one</block>
      </editor>
    )
    const test = editor => {
      return Editor.path(editor, { path: [0, 0], offset: 1 })
    }
    const output = [0, 0]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('path-range-end', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const test = editor => {
      return Editor.path(
        editor,
        {
          anchor: { path: [0, 0], offset: 1 },
          focus: { path: [1, 0], offset: 2 },
        },
        { edge: 'end' }
      )
    }
    const output = [1, 0]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('path-range-start', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const test = editor => {
      return Editor.path(
        editor,
        {
          anchor: { path: [0, 0], offset: 1 },
          focus: { path: [1, 0], offset: 2 },
        },
        { edge: 'start' }
      )
    }
    const output = [0, 0]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('path-range', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const test = editor => {
      return Editor.path(editor, {
        anchor: { path: [0, 0], offset: 1 },
        focus: { path: [1, 0], offset: 2 },
      })
    }
    const output = []

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })
})
