/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { jsx } from 'slate-hyperscript'
import { withTest } from '../with-test'
import { Editor } from 'slate'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('remove_text', () => {
  test('remove_text-anchor-after', () => {
    const input = (
      <editor>
        <element>
          wor
          <anchor />d<focus />
        </element>
      </editor>
    )
    const operations = [
      {
        type: 'remove_text',
        path: [0, 0],
        offset: 1,
        text: 'or',
      },
    ]
    const output = (
      <editor>
        <element>
          w<anchor />d<focus />
        </element>
      </editor>
    )

    const editor = withTest(input)
    Editor.withoutNormalizing(editor, () => {
      for (const op of operations) {
        editor.apply(op)
      }
    })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('remove_text-anchor-before', () => {
    const input = (
      <editor>
        <element>
          w<anchor />
          ord
          <focus />
        </element>
      </editor>
    )
    const operations = [
      {
        type: 'remove_text',
        path: [0, 0],
        offset: 1,
        text: 'or',
      },
    ]
    const output = (
      <editor>
        <element>
          w<anchor />d<focus />
        </element>
      </editor>
    )

    const editor = withTest(input)
    Editor.withoutNormalizing(editor, () => {
      for (const op of operations) {
        editor.apply(op)
      }
    })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('remove_text-anchor-middle', () => {
    const input = (
      <editor>
        <element>
          wo
          <anchor />
          rd
          <focus />
        </element>
      </editor>
    )
    const operations = [
      {
        type: 'remove_text',
        path: [0, 0],
        offset: 1,
        text: 'or',
      },
    ]
    const output = (
      <editor>
        <element>
          w<anchor />d<focus />
        </element>
      </editor>
    )

    const editor = withTest(input)
    Editor.withoutNormalizing(editor, () => {
      for (const op of operations) {
        editor.apply(op)
      }
    })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('remove_text-cursor-after', () => {
    const input = (
      <editor>
        <element>
          wor
          <cursor />d
        </element>
      </editor>
    )
    const operations = [
      {
        type: 'remove_text',
        path: [0, 0],
        offset: 1,
        text: 'or',
      },
    ]
    const output = (
      <editor>
        <element>
          w<cursor />d
        </element>
      </editor>
    )

    const editor = withTest(input)
    Editor.withoutNormalizing(editor, () => {
      for (const op of operations) {
        editor.apply(op)
      }
    })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('remove_text-cursor-before', () => {
    const input = (
      <editor>
        <element>
          w<cursor />
          ord
        </element>
      </editor>
    )
    const operations = [
      {
        type: 'remove_text',
        path: [0, 0],
        offset: 1,
        text: 'or',
      },
    ]
    const output = (
      <editor>
        <element>
          w<cursor />d
        </element>
      </editor>
    )

    const editor = withTest(input)
    Editor.withoutNormalizing(editor, () => {
      for (const op of operations) {
        editor.apply(op)
      }
    })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('remove_text-cursor-middle', () => {
    const input = (
      <editor>
        <element>
          wo
          <cursor />
          rd
        </element>
      </editor>
    )
    const operations = [
      {
        type: 'remove_text',
        path: [0, 0],
        offset: 1,
        text: 'or',
      },
    ]
    const output = (
      <editor>
        <element>
          w<cursor />d
        </element>
      </editor>
    )

    const editor = withTest(input)
    Editor.withoutNormalizing(editor, () => {
      for (const op of operations) {
        editor.apply(op)
      }
    })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('remove_text-focus-after', () => {
    const input = (
      <editor>
        <element>
          <anchor />
          wor
          <focus />d
        </element>
      </editor>
    )
    const operations = [
      {
        type: 'remove_text',
        path: [0, 0],
        offset: 1,
        text: 'or',
      },
    ]
    const output = (
      <editor>
        <element>
          <anchor />w<focus />d
        </element>
      </editor>
    )

    const editor = withTest(input)
    Editor.withoutNormalizing(editor, () => {
      for (const op of operations) {
        editor.apply(op)
      }
    })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('remove_text-focus-before', () => {
    const input = (
      <editor>
        <element>
          <anchor />w<focus />
          ord
        </element>
      </editor>
    )
    const operations = [
      {
        type: 'remove_text',
        path: [0, 0],
        offset: 1,
        text: 'or',
      },
    ]
    const output = (
      <editor>
        <element>
          <anchor />w<focus />d
        </element>
      </editor>
    )

    const editor = withTest(input)
    Editor.withoutNormalizing(editor, () => {
      for (const op of operations) {
        editor.apply(op)
      }
    })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('remove_text-focus-middle', () => {
    const input = (
      <editor>
        <element>
          <anchor />
          wo
          <focus />
          rd
        </element>
      </editor>
    )
    const operations = [
      {
        type: 'remove_text',
        path: [0, 0],
        offset: 1,
        text: 'or',
      },
    ]
    const output = (
      <editor>
        <element>
          <anchor />w<focus />d
        </element>
      </editor>
    )

    const editor = withTest(input)
    Editor.withoutNormalizing(editor, () => {
      for (const op of operations) {
        editor.apply(op)
      }
    })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })
})
