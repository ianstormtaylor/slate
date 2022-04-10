/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { jsx } from '../jsx'
import { Editor, Transforms } from 'slate'
import { withTest } from '../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('moveNodes', () => {
  test('moveNodes-path-inside-next', () => {
    const input = (
      <editor>
        <block>
          <cursor />
          one
        </block>
        <block>
          <block>two</block>
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.moveNodes(editor, { at: [0], to: [1, 1] })
    }
    const output = (
      <editor>
        <block>
          <block>two</block>
          <block>
            <cursor />
            one
          </block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('moveNodes-path-nested', () => {
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
      Transforms.moveNodes(editor, { at: [0, 0], to: [1, 0] })
    }
    const output = (
      <editor>
        <block>
          <text />
        </block>
        <block>
          <block>one</block>
          <block>two</block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('moveNodes-path-noop-equal', () => {
    const input = (
      <editor>
        <block>1</block>
        <block>2</block>
      </editor>
    )
    const run = editor => {
      Transforms.moveNodes(editor, { at: [1], to: [1] })
    }
    const output = (
      <editor>
        <block>1</block>
        <block>2</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('moveNodes-path-text-nodes', () => {
    const input = (
      <editor>
        <block>
          <text>bar</text>
          <text>foo</text>
        </block>
        <block>
          <cursor />
          baz
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.moveNodes(editor, { at: [0, 0], to: [1, 0] })
    }
    const output = (
      <editor>
        <block>
          <text>foo</text>
        </block>
        <block>
          <text>
            bar
            <cursor />
            baz
          </text>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('moveNodes-path-text', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const run = editor => {
      Transforms.moveNodes(editor, { at: [1, 0], to: [0, 1] })
    }
    const output = (
      <editor>
        <block>onetwo</block>
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

  test('moveNodes-path-to-sibling', () => {
    const input = (
      <editor>
        <block>
          <cursor />
          one
        </block>
        <block>
          <block>two</block>
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.moveNodes(editor, { at: [0], to: [1, 1] })
    }
    const output = (
      <editor>
        <block>
          <block>two</block>
          <block>
            <cursor />
            one
          </block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('moveNodes-selection-block-nested-after', () => {
    const run = editor => {
      Transforms.moveNodes(editor, {
        match: n => Editor.isBlock(editor, n),
        to: [1],
      })
    }
    const input = (
      <editor>
        <block>
          <block>one</block>
          <block>
            <anchor />
            two
          </block>
          <block>
            three
            <focus />
          </block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <block>one</block>
        </block>
        <block>
          <anchor />
          two
        </block>
        <block>
          three
          <focus />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('moveNodes-selection-block-nested-before', () => {
    const run = editor => {
      Transforms.moveNodes(editor, {
        match: n => Editor.isBlock(editor, n),
        to: [0],
      })
    }
    const input = (
      <editor>
        <block>
          <block>
            <anchor />
            one
          </block>
          <block>
            two
            <focus />
          </block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <anchor />
          one
        </block>
        <block>
          two
          <focus />
        </block>
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

  test('moveNodes-selection-block-siblings-after', () => {
    const run = editor => {
      Transforms.moveNodes(editor, {
        match: n => Editor.isBlock(editor, n),
        to: [2],
      })
    }
    const input = (
      <editor>
        <block>
          <anchor />
          one
        </block>
        <block>
          two
          <focus />
        </block>
        <block>three</block>
      </editor>
    )

    const output = (
      <editor>
        <block>three</block>
        <block>
          <anchor />
          one
        </block>
        <block>
          two
          <focus />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('moveNodes-selection-block-siblings-before', () => {
    const run = editor => {
      Transforms.moveNodes(editor, {
        match: n => Editor.isBlock(editor, n),
        to: [0],
      })
    }
    const input = (
      <editor>
        <block>one</block>
        <block>
          two
          <anchor />
        </block>
        <block>
          three
          <focus />
        </block>
      </editor>
    )

    const output = (
      <editor>
        <block>
          two
          <anchor />
        </block>
        <block>
          three
          <focus />
        </block>
        <block>one</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('moveNodes-selection-block', () => {
    const input = (
      <editor>
        <block>
          <cursor />
          one
        </block>
        <block>two</block>
      </editor>
    )
    const run = editor => {
      Transforms.moveNodes(editor, {
        match: n => Editor.isBlock(editor, n),
        to: [1],
      })
    }
    const output = (
      <editor>
        <block>two</block>
        <block>
          <cursor />
          one
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('moveNodes-voids-true-block', () => {
    const input = (
      <editor>
        <block void>one</block>
        <block void>two</block>
        <block void>three</block>
      </editor>
    )
    const run = editor => {
      Transforms.moveNodes(editor, {
        at: [1, 0],
        to: [2, 0],
        voids: true,
      })
    }
    const output = (
      <editor>
        <block void>one</block>
        <block void>
          <text />
        </block>
        <block void>twothree</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('moveNodes-voids-true-inline', () => {
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            <cursor />
            one
          </inline>
          <text />
          <inline>two</inline>
          <text />
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.moveNodes(editor, { at: [0, 1], to: [0, 3] })
    }
    const output = (
      <editor>
        <block>
          <text />
          <inline>two</inline>
          <text />
          <inline>
            <cursor />
            one
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
