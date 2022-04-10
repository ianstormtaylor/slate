/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { Editor, Transforms } from 'slate'
import { jsx } from '../jsx'
import { withTest } from '../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('splitNodes', () => {
  test('splitNodes-always-after-inline-void', () => {
    const run = editor => {
      Transforms.splitNodes(editor, {
        match: n => Editor.isBlock(editor, n),
        always: true,
      })
    }
    const input = (
      <editor>
        <block>
          one
          <inline void>
            <text />
          </inline>
          <cursor />
          two
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one
          <inline void>
            <text />
          </inline>
          <text />
        </block>
        <block>
          <cursor />
          two
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('splitNodes-always-after-inline', () => {
    const run = editor => {
      Transforms.splitNodes(editor, {
        match: n => Editor.isBlock(editor, n),
        always: true,
      })
    }
    const input = (
      <editor>
        <block>
          word
          <inline>hyperlink</inline>
          <cursor />
          word
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          word
          <inline>hyperlink</inline>
          <text />
        </block>
        <block>
          <cursor />
          word
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('splitNodes-always-before-inline', () => {
    const run = editor => {
      Transforms.splitNodes(editor, {
        match: n => Editor.isBlock(editor, n),
        always: true,
      })
    }
    const input = (
      <editor>
        <block>
          word
          <cursor />
          <inline>hyperlink</inline>
          word
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>word</block>
        <block>
          <cursor />
          <inline>hyperlink</inline>
          word
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('splitNodes-always-block-end', () => {
    const run = editor => {
      Transforms.splitNodes(editor, {
        match: n => Editor.isBlock(editor, n),
        always: true,
      })
    }
    const input = (
      <editor>
        <block>
          word
          <cursor />
        </block>
        <block>another</block>
      </editor>
    )
    const output = (
      <editor>
        <block>word</block>
        <block>
          <cursor />
        </block>
        <block>another</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('splitNodes-always-block-start', () => {
    const run = editor => {
      Transforms.splitNodes(editor, {
        match: n => Editor.isBlock(editor, n),
        always: true,
      })
    }
    const input = (
      <editor>
        <block>word</block>
        <block>
          <cursor />
          another
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>word</block>
        <block>
          <text />
        </block>
        <block>
          <cursor />
          another
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('splitNodes-match-any-zero', () => {
    const run = editor => {
      Transforms.splitNodes(editor, { match: () => true, mode: 'highest' })
    }
    const input = (
      <editor>
        <block>
          <block>
            <block>
              wo
              <cursor />
              rd
            </block>
          </block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <block>
            <block>wo</block>
          </block>
        </block>
        <block>
          <block>
            <block>
              <cursor />
              rd
            </block>
          </block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('splitNodes-match-block-block-middle-multiple-texts', () => {
    const run = editor => {
      Transforms.splitNodes(editor, { match: n => Editor.isBlock(editor, n) })
    }
    const input = (
      <editor>
        <block>
          <text>
            one
            <cursor />
          </text>
          <text>two</text>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one
          <cursor />
        </block>
        <block>two</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('splitNodes-match-block-block-middle', () => {
    const run = editor => {
      Transforms.splitNodes(editor, { match: n => Editor.isBlock(editor, n) })
    }
    const input = (
      <editor>
        <block>
          wo
          <cursor />
          rd
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>wo</block>
        <block>
          <cursor />
          rd
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('splitNodes-match-block-inline-middle', () => {
    const run = editor => {
      Transforms.splitNodes(editor, { match: n => Editor.isBlock(editor, n) })
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            wo
            <cursor />
            rd
          </inline>
          <text />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text />
          <inline>wo</inline>
          <text />
        </block>
        <block>
          <text />
          <inline>
            <cursor />
            rd
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

  test('splitNodes-match-inline-inline-middle', () => {
    const run = editor => {
      Transforms.splitNodes(editor, { match: n => Editor.isInline(editor, n) })
    }

    const input = (
      <editor>
        <block>
          <text />
          <inline>
            wo
            <cursor />
            rd
          </inline>
          <text />
        </block>
      </editor>
    )

    const output = (
      <editor>
        <block>
          <text />
          <inline>wo</inline>
          <text />
          <inline>
            <cursor />
            rd
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

  test('splitNodes-path-block-inline', () => {
    const run = editor => {
      Transforms.splitNodes(editor, { at: [0, 2] })
    }
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
    const output = (
      <editor>
        <block>
          <text />
          <inline>one</inline>
          <text />
        </block>
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

  test('splitNodes-path-block-nested-void', () => {
    const run = editor => {
      Transforms.splitNodes(editor, { at: [0, 1] })
    }
    const input = (
      <editor>
        <block>
          <block void>one</block>
          <block void>two</block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <block void>one</block>
        </block>
        <block>
          <block void>two</block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('splitNodes-path-block-nested', () => {
    const run = editor => {
      Transforms.splitNodes(editor, { at: [0, 1] })
    }
    const input = (
      <editor>
        <block>
          <block>one</block>
          <block>two</block>
          <block>three</block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <block>one</block>
        </block>
        <block>
          <block>two</block>
          <block>three</block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('splitNodes-path-block-void', () => {
    const run = editor => {
      Transforms.splitNodes(editor, { at: [0, 1] })
    }
    const input = (
      <editor>
        <block void>
          <block>one</block>
          <block>two</block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block void>
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

  test('splitNodes-path-block-with-attributes', () => {
    const run = editor => {
      Transforms.splitNodes(editor, { at: [0, 2] })
    }
    const input = (
      <editor>
        <block data>
          <text />
          <inline>one</inline>
          <text />
          <inline>two</inline>
          <text />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block data>
          <text />
          <inline>one</inline>
          <text />
        </block>
        <block data>
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

  test('splitNodes-path-inline-void', () => {
    const run = editor => {
      Transforms.splitNodes(editor, { at: [0, 1, 0] })
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline void>
            <text>word</text>
          </inline>
          <text />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text />
          <inline void>
            <text>word</text>
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

  test('splitNodes-path-inline', () => {
    const run = editor => {
      Transforms.splitNodes(editor, { at: [0, 1, 0] })
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            <text>word</text>
          </inline>
          <text />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text />
          <inline>
            <text />
          </inline>
          <text />
          <inline>
            <text>word</text>
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

  test('splitNodes-point-block-void', () => {
    const run = editor => {
      Transforms.splitNodes(editor, { at: { path: [0, 0], offset: 2 } })
    }
    const input = (
      <editor>
        <block void>word</block>
      </editor>
    )
    const output = (
      <editor>
        <block void>word</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('splitNodes-point-inline-void', () => {
    const run = editor => {
      Transforms.splitNodes(editor, { at: { path: [0, 1, 0], offset: 2 } })
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline void>
            <text>word</text>
          </inline>
          <text />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text />
          <inline void>
            <text>word</text>
          </inline>
          <text />
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

  test('splitNodes-point-inline', () => {
    const run = editor => {
      Transforms.splitNodes(editor, {
        at: { path: [0, 1, 0], offset: 2 },
        match: n => Editor.isInline(editor, n),
      })
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            <text>word</text>
          </inline>
          <text />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text />
          <inline>
            <text>wo</text>
          </inline>
          <text />
          <inline>
            <text>rd</text>
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

  test('splitNodes-point-text-with-marks', () => {
    const run = editor => {
      Transforms.splitNodes(editor, {
        at: { path: [0, 0], offset: 2 },
      })
    }
    const input = (
      <editor>
        <block>
          <text bold>word</text>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text bold>wo</text>
        </block>
        <block>
          <text bold>rd</text>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('splitNodes-selection-block-across', () => {
    const run = editor => {
      Transforms.splitNodes(editor)
    }
    const input = (
      <editor>
        <block>
          wo
          <anchor />
          rd
        </block>
        <block>
          an
          <focus />
          other
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>wo</block>
        <block>
          <cursor />
          other
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('splitNodes-selection-block-expanded', () => {
    const run = editor => {
      Transforms.splitNodes(editor)
    }
    const input = (
      <editor>
        <block>
          w<anchor />
          or
          <focus />d
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>w</block>
        <block>
          <cursor />d
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('splitNodes-selection-block-hanging', () => {
    const run = editor => {
      Transforms.splitNodes(editor)
    }
    const input = (
      <editor>
        <block>one</block>
        <block>
          <anchor />
          two
        </block>
        <block>
          <focus />
          three
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>one</block>
        <block>
          <text />
        </block>
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

  test('splitNodes-selection-block-nested-void', () => {
    const run = editor => {
      Transforms.splitNodes(editor)
    }
    const input = (
      <editor>
        <block>
          <block void>
            wo
            <anchor />
            rd
          </block>
          <block void>
            an
            <focus />
            other
          </block>
        </block>
      </editor>
    )
    const output = (
      <editor>
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

  test('splitNodes-selection-block-void-end', () => {
    const run = editor => {
      Transforms.splitNodes(editor)
    }
    const input = (
      <editor>
        <block>
          wo
          <anchor />
          rd
        </block>
        <block void>
          an
          <focus />
          other
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          wo
          <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('splitNodes-selection-block-void-middle', () => {
    const run = editor => {
      Transforms.splitNodes(editor)
    }
    const input = (
      <editor>
        <block>
          on
          <anchor />e
        </block>
        <block void>two</block>
        <block>
          th
          <focus />
          ree
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>on</block>
        <block>
          <cursor />
          ree
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('splitNodes-selection-block-void-start', () => {
    const run = editor => {
      Transforms.splitNodes(editor)
    }
    const input = (
      <editor>
        <block void>
          wo
          <anchor />
          rd
        </block>
        <block>
          an
          <focus />
          other
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <cursor />
          other
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('splitNodes-selection-inline-across', () => {
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            wo
            <anchor />
            rd
          </inline>
          <text />
        </block>
        <block>
          <text />
          <inline>
            an
            <focus />
            other
          </inline>
          <text />
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.splitNodes(editor)
    }
    const output = (
      <editor>
        <block>
          <text />
          <inline>wo</inline>
          <text />
        </block>
        <block>
          <text />
          <inline>
            <cursor />
            other
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

  test('splitNodes-selection-inline-expanded', () => {
    const run = editor => {
      Transforms.splitNodes(editor)
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            w<anchor />
            or
            <focus />d
          </inline>
          <text />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text />
          <inline>w</inline>
          <text />
        </block>
        <block>
          <text />
          <inline>
            <cursor />d
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

  test('splitNodes-selection-inline-void-end', () => {
    const run = editor => {
      Transforms.splitNodes(editor)
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline void>
            word
            <cursor />
          </inline>
          <text />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text />
          <inline void>word</inline>
          <text />
        </block>
        <block>
          <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('splitNodes-selection-inline-void', () => {
    const run = editor => {
      Transforms.splitNodes(editor)
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline void>
            wo
            <cursor />
            rd
          </inline>
          <text />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text />
          <inline void>word</inline>
          <text />
        </block>
        <block>
          <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('splitNodes-voids-true-block', () => {
    const run = editor => {
      Transforms.splitNodes(editor, { at: [0, 1], voids: true })
    }
    const input = (
      <editor>
        <block void>
          <block>one</block>
          <block>two</block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block void>
          <block>one</block>
        </block>
        <block void>
          <block>two</block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('splitNodes-voids-true-inline', () => {
    const run = editor => {
      Transforms.splitNodes(editor, { at: [0, 1, 1], voids: true })
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline void>
            <text>one</text>
            <text>two</text>
          </inline>
          <text />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text />
          <inline void>
            <text>one</text>
          </inline>
          <text />
          <inline void>
            <text>two</text>
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
