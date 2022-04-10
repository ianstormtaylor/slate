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

describe.concurrent('edges', () => {
  test('edges-path', () => {
    const input = (
      <editor>
        <block>one</block>
      </editor>
    )

    const test = editor => {
      return Editor.edges(editor, [0])
    }

    const output = [
      { path: [0, 0], offset: 0 },
      { path: [0, 0], offset: 3 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('edges-point', () => {
    const input = (
      <editor>
        <block>one</block>
      </editor>
    )

    const test = editor => {
      return Editor.edges(editor, { path: [0, 0], offset: 1 })
    }

    const output = [
      { path: [0, 0], offset: 1 },
      { path: [0, 0], offset: 1 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('edges-range', () => {
    const input = (
      <editor>
        <block>one</block>
      </editor>
    )

    const test = editor => {
      return Editor.edges(editor, {
        anchor: { path: [0, 0], offset: 1 },
        focus: { path: [0, 0], offset: 3 },
      })
    }

    const output = [
      { path: [0, 0], offset: 1 },
      { path: [0, 0], offset: 3 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })
})
