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

describe.concurrent('end', () => {
  test('end-path', () => {
    const input = (
      <editor>
        <block>one</block>
      </editor>
    )
    const test = editor => {
      return Editor.end(editor, [0])
    }
    const output = { path: [0, 0], offset: 3 }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('end-point', () => {
    const input = (
      <editor>
        <block>one</block>
      </editor>
    )
    const test = editor => {
      return Editor.end(editor, { path: [0, 0], offset: 1 })
    }
    const output = { path: [0, 0], offset: 1 }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('end-range', () => {
    const input = (
      <editor>
        <block>one</block>
      </editor>
    )
    const test = editor => {
      return Editor.end(editor, {
        anchor: { path: [0, 0], offset: 1 },
        focus: { path: [0, 0], offset: 2 },
      })
    }
    const output = { path: [0, 0], offset: 2 }

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })
})
