/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { Transforms } from 'slate'
import { jsx } from '../jsx'
import { withTest } from '../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('select', () => {
  test('select-path', () => {
    const run = editor => {
      Transforms.select(editor, [0, 0])
    }
    const input = (
      <editor>
        <block>
          <cursor />
          one
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <anchor />
          one
          <focus />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('select-point', () => {
    const run = editor => {
      Transforms.select(editor, {
        path: [0, 0],
        offset: 1,
      })
    }
    const input = (
      <editor>
        <block>
          <cursor />
          one
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          o<cursor />
          ne
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('select-range', () => {
    const run = editor => {
      Transforms.select(editor, {
        anchor: {
          path: [0, 0],
          offset: 0,
        },
        focus: {
          path: [0, 0],
          offset: 3,
        },
      })
    }
    const input = (
      <editor>
        <block>
          <cursor />
          one
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <anchor />
          one
          <focus />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })
})
