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

describe.concurrent('before', () => {
  test('before-path-void', () => {
    const input = (
      <editor>
        <block void>one</block>
        <block void>two</block>
      </editor>
    )

    const test = editor => {
      return Editor.before(editor, [1, 0], { voids: true })
    }

    const output = { path: [0, 0], offset: 3 }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('before-path', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )

    const test = editor => {
      return Editor.before(editor, [1, 0])
    }

    const output = { path: [0, 0], offset: 3 }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('before-point-void', () => {
    const input = (
      <editor>
        <block void>one</block>
      </editor>
    )

    const test = editor => {
      return Editor.before(editor, { path: [0, 0], offset: 1 }, { voids: true })
    }

    const output = { path: [0, 0], offset: 0 }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('before-point', () => {
    const input = (
      <editor>
        <block>one</block>
      </editor>
    )

    const test = editor => {
      return Editor.before(editor, { path: [0, 0], offset: 1 })
    }

    const output = { path: [0, 0], offset: 0 }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('before-range-void', () => {
    const input = (
      <editor>
        <block void>one</block>
        <block void>two</block>
      </editor>
    )

    const test = editor => {
      return Editor.before(
        editor,
        {
          anchor: { path: [0, 0], offset: 1 },
          focus: { path: [0, 1], offset: 2 },
        },
        { voids: true }
      )
    }

    const output = { path: [0, 0], offset: 0 }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('before-range', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )

    const test = editor => {
      return Editor.before(editor, {
        anchor: { path: [0, 0], offset: 1 },
        focus: { path: [0, 1], offset: 2 },
      })
    }

    const output = { path: [0, 0], offset: 0 }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('before-start', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )

    const test = editor => {
      return Editor.before(editor, [0, 0])
    }

    const output = undefined

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })
})
