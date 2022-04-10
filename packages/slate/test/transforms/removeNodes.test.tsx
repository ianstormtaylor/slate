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

describe.concurrent('removeNodes', () => {
  test('removeNodes-path-block-nested', () => {
    const input = (
      <editor>
        <block>
          <block>one</block>
        </block>
        <block>
          <block>two</block>
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.removeNodes(editor, { at: [0, 0] })
    }
    const output = (
      <editor>
        <block>
          <text />
        </block>
        <block>
          <block>two</block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('removeNodes-path-block', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const run = editor => {
      Transforms.removeNodes(editor, { at: [0] })
    }
    const output = (
      <editor>
        <block>two</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('removeNodes-path-inline', () => {
    const input = (
      <editor>
        <block>
          <text />
          <inline>one</inline>
          <text />
          <inline>two</inline>
          <text />
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.removeNodes(editor, { at: [0, 1] })
    }
    const output = (
      <editor>
        <block>
          <text />
          <inline>two</inline>
          <text />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('removeNodes-path-text', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const run = editor => {
      Transforms.removeNodes(editor, { at: [1, 0] })
    }
    const output = (
      <editor>
        <block>one</block>
        <block>
          <text />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('removeNodes-select-block-only-void', () => {
    const input = (
      <editor>
        <block void>
          <cursor />
          one
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.removeNodes(editor, { at: [0] })
    }
    const output = <editor />

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('removeNodes-select-block-void-multiple-texts', () => {
    const input = (
      <editor>
        <block void>
          <text>
            <cursor />
            one
          </text>
          <text>two</text>
        </block>
        <block>three</block>
      </editor>
    )
    const run = editor => {
      Transforms.removeNodes(editor, { at: [0] })
    }
    const output = (
      <editor>
        <block>
          <cursor />
          three
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('removeNodes-select-block-void', () => {
    const input = (
      <editor>
        <block void>
          <cursor />
          one
        </block>
        <block>two</block>
        <block>three</block>
      </editor>
    )
    const run = editor => {
      Transforms.removeNodes(editor, { at: [0] })
    }
    const output = (
      <editor>
        <block>
          <cursor />
          two
        </block>
        <block>three</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('removeNodes-selection-block-across', () => {
    const input = (
      <editor>
        <block>
          on
          <anchor />e
        </block>
        <block>
          t<focus />
          wo
        </block>
        <block>three</block>
      </editor>
    )
    const run = editor => {
      Transforms.removeNodes(editor)
    }
    const output = (
      <editor>
        <block>
          <cursor />
          three
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('removeNodes-selection-block-all', () => {
    const input = (
      <editor>
        <block>
          on
          <anchor />e
        </block>
        <block>
          t<focus />
          wo
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.removeNodes(editor)
    }
    const output = <editor />

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('removeNodes-voids-true-block', () => {
    const input = (
      <editor>
        <block void>one</block>
      </editor>
    )
    const run = editor => {
      Transforms.removeNodes(editor, { at: [0, 0], voids: true })
    }
    const output = (
      <editor>
        <block void>
          <text />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('removeNodes-voids-true-inline', () => {
    const input = (
      <editor>
        <block>
          <text />
          <inline void>one</inline>
          <text />
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.removeNodes(editor, { at: [0, 1, 0], voids: true })
    }
    const output = (
      <editor>
        <block>
          <text />
          <inline void>
            <text />
          </inline>
          <text />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })
})
