/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { Editor } from 'slate'
import { jsx } from 'slate-hyperscript'
import { withTest } from '../../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('levels', () => {
  test('levels-match', () => {
    const input = (
      <editor>
        <element a>
          <text a />
        </element>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.levels(editor, {
          at: [0, 0],
          match: n => n.a,
        })
      )
    }
    const output = [
      [
        <element a>
          <text a />
        </element>,
        [0],
      ],
      [<text a />, [0, 0]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('levels-reverse', () => {
    const input = (
      <editor>
        <element>
          <text />
        </element>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.levels(editor, {
          at: [0, 0],
          reverse: true,
        })
      )
    }
    const output = [
      [<text />, [0, 0]],
      [
        <element>
          <text />
        </element>,
        [0],
      ],
      [input, []],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('levels-success', () => {
    const input = (
      <editor>
        <element>
          <text />
        </element>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.levels(editor, { at: [0, 0] }))
    }
    const output = [
      [input, []],
      [
        <element>
          <text />
        </element>,
        [0],
      ],
      [<text />, [0, 0]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('levels-voids-false', () => {
    const input = (
      <editor>
        <element void>
          <text />
        </element>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.levels(editor, { at: [0, 0] }))
    }
    const output = [
      [input, []],
      [
        <element void>
          <text />
        </element>,
        [0],
      ],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('levels-voids-true', () => {
    const input = (
      <editor>
        <element void>
          <text />
        </element>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.levels(editor, {
          at: [0, 0],
          voids: true,
        })
      )
    }
    const output = [
      [input, []],
      [
        <element void>
          <text />
        </element>,
        [0],
      ],
      [<text />, [0, 0]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })
})
