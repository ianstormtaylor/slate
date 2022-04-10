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

describe.concurrent('point', () => {
  test('point-path-end', () => {
    const input = (
      <editor>
        <block>one</block>
      </editor>
    )
    const test = editor => {
      return Editor.point(editor, [0], { edge: 'end' })
    }
    const output = { path: [0, 0], offset: 3 }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('point-path-start', () => {
    const input = (
      <editor>
        <block>one</block>
      </editor>
    )
    const test = editor => {
      return Editor.point(editor, [0], { edge: 'start' })
    }
    const output = { path: [0, 0], offset: 0 }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('point-path', () => {
    const input = (
      <editor>
        <block>one</block>
      </editor>
    )
    const test = editor => {
      return Editor.point(editor, [0])
    }
    const output = { path: [0, 0], offset: 0 }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('point-point', () => {
    const input = (
      <editor>
        <block>one</block>
      </editor>
    )
    const test = editor => {
      return Editor.point(editor, { path: [0, 0], offset: 1 })
    }
    const output = { path: [0, 0], offset: 1 }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('point-range-end', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const test = editor => {
      return Editor.point(
        editor,
        {
          anchor: { path: [0, 0], offset: 1 },
          focus: { path: [0, 1], offset: 2 },
        },
        { edge: 'end' }
      )
    }
    const output = { path: [0, 1], offset: 2 }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('point-range-start', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const test = editor => {
      return Editor.point(
        editor,
        {
          anchor: { path: [0, 0], offset: 1 },
          focus: { path: [0, 1], offset: 2 },
        },
        { edge: 'start' }
      )
    }
    const output = { path: [0, 0], offset: 1 }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('point-range', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const test = editor => {
      return Editor.point(editor, {
        anchor: { path: [0, 0], offset: 1 },
        focus: { path: [0, 1], offset: 2 },
      })
    }
    const output = { path: [0, 0], offset: 1 }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })
})
