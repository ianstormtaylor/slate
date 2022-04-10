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

describe.concurrent('insertNodes', () => {
  test('insertNodes-block-block-empty', () => {
    const input = (
      <editor>
        <block>
          <cursor />
        </block>
        <block>not empty</block>
      </editor>
    )
    const run = editor => {
      Transforms.insertNodes(
        editor,
        <block>
          <text />
        </block>
      )
    }
    const output = (
      <editor>
        <block>
          <text />
        </block>
        <block>
          <cursor />
        </block>
        <block>not empty</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertNodes-block-block-middle', () => {
    const run = editor => {
      Transforms.insertNodes(
        editor,
        <block>
          <text />
        </block>
      )
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
        </block>
        <block>rd</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertNodes-block-block-void', () => {
    const run = editor => {
      Transforms.insertNodes(
        editor,
        <block>
          <text />
        </block>
      )
    }
    const input = (
      <editor>
        <block void>
          text
          <cursor />
        </block>
        <block>text</block>
      </editor>
    )
    const output = (
      <editor>
        <block void>text</block>
        <block>
          <cursor />
        </block>
        <block>text</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertNodes-block-inline-void', () => {
    const run = editor => {
      Transforms.insertNodes(
        editor,
        <block>
          <text />
        </block>
      )
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline void>
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
          <inline void>
            <text />
          </inline>
          <text />
        </block>
        <block>
          <cursor />
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

  test('insertNodes-inline-block-empty', () => {
    const input = (
      <editor>
        <block>
          <cursor />
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.insertNodes(
        editor,
        <inline void>
          <text />
        </inline>
      )
    }
    const output = (
      <editor>
        <block>
          <text />
          <inline void>
            <cursor />
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

  test('insertNodes-inline-block-end', () => {
    const run = editor => {
      Transforms.insertNodes(
        editor,
        <inline void>
          <text />
        </inline>
      )
    }
    const input = (
      <editor>
        <block>
          word
          <cursor />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          word
          <inline void>
            <cursor />
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

  test('insertNodes-inline-block-middle', () => {
    const run = editor => {
      Transforms.insertNodes(
        editor,
        <inline void>
          <text />
        </inline>
      )
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
        <block>
          wo
          <inline void>
            <cursor />
          </inline>
          rd
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertNodes-inline-block-start', () => {
    const run = editor => {
      Transforms.insertNodes(
        editor,
        <inline void>
          <text />
        </inline>
      )
    }
    const input = (
      <editor>
        <block>
          <cursor />
          word
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text />
          <inline void>
            <cursor />
          </inline>
          word
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertNodes-inline-block-void', () => {
    const run = editor => {
      Transforms.insertNodes(
        editor,
        <inline void>
          <text />
        </inline>
      )
    }
    const input = (
      <editor>
        <block void>
          <cursor />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block void>
          <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertNodes-inline-inline-middle', () => {
    const run = editor => {
      Transforms.insertNodes(
        editor,
        <inline void>
          <text />
        </inline>
      )
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
          <inline>
            wo
            <inline void>
              <cursor />
            </inline>
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

  test('insertNodes-path-block', () => {
    const input = (
      <editor>
        <block>
          <cursor />
          one
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.insertNodes(
        editor,
        <block>
          <text />
        </block>,
        { at: [0] }
      )
    }
    const output = (
      <editor>
        <block>
          <text />
        </block>
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

  test('insertNodes-path-inline', () => {
    const input = (
      <editor>
        <block>
          <cursor />
          word
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.insertNodes(
        editor,
        <inline>
          <text />
        </inline>,
        { at: [0, 0] }
      )
    }
    const output = (
      <editor>
        <block>
          <text />
          <inline>
            <text />
          </inline>
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

  test('insertNodes-path-multiple-inline-not-end', () => {
    const input = (
      <editor>
        <block>
          hel
          <cursor />
          lo
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.insertNodes(editor, [
        <inline>
          <text />
        </inline>,
        <text>world</text>,
      ])
    }
    const output = (
      <editor>
        <block>
          hel
          <inline>
            <text />
          </inline>
          world
          <cursor />
          lo
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertNodes-path-multiple-inline', () => {
    const input = (
      <editor>
        <block>
          hello
          <cursor />
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.insertNodes(editor, [
        <inline>
          <text />
        </inline>,
        <text>world</text>,
      ])
    }
    const output = (
      <editor>
        <block>
          hello
          <inline>
            <text />
          </inline>
          world
          <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertNodes-path-multiple', () => {
    const input = (
      <editor>
        <block>
          <cursor />
          one
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.insertNodes(
        editor,
        [<block>two</block>, <block>three</block>],
        {
          at: [0],
        }
      )
    }
    const output = (
      <editor>
        <block>two</block>
        <block>three</block>
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

  test('insertNodes-path-text', () => {
    const input = (
      <editor>
        <block>
          <cursor />
          word
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.insertNodes(editor, <text>another</text>, { at: [0, 0] })
    }
    const output = (
      <editor>
        <block>
          another
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

  test('insertNodes-select-true-block', () => {
    const input = (
      <editor>
        <block>
          <cursor />
          one
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.insertNodes(
        editor,
        <block>
          <text />
        </block>,
        { at: [0], select: true }
      )
    }
    const output = (
      <editor>
        <block>
          <cursor />
        </block>
        <block>one</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertNodes-selection-none-empty', () => {
    const input = <editor />
    const run = editor => {
      Transforms.insertNodes(editor, <block>one</block>)
    }
    const output = (
      <editor>
        <block>
          one
          <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertNodes-selection-none-end', () => {
    const input = (
      <editor>
        <block>one</block>
      </editor>
    )
    const run = editor => {
      Transforms.insertNodes(editor, <block>two</block>)
    }
    const output = (
      <editor>
        <block>one</block>
        <block>
          two
          <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertNodes-void-at-path', () => {
    const input = (
      <editor>
        <block>
          one
          <cursor />
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.insertNodes(
        editor,
        <block void>
          <text>two</text>
        </block>,
        { at: [1], select: true }
      )
    }
    const output = (
      <editor>
        <block>one</block>
        <block void>
          two
          <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertNodes-void-block-nested', () => {
    const input = (
      <editor>
        <block>
          one
          <cursor />
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.insertNodes(
        editor,
        <block void>
          <block>
            <text>two</text>
          </block>
        </block>
      )
    }
    const output = (
      <editor>
        <block>one</block>
        <block void>
          <block>
            <text>
              two
              <cursor />
            </text>
          </block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertNodes-void-block', () => {
    const input = (
      <editor>
        <block>
          one
          <cursor />
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.insertNodes(
        editor,
        <block void>
          <text>two</text>
        </block>
      )
    }
    const output = (
      <editor>
        <block>one</block>
        <block void>
          two
          <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertNodes-void-inline', () => {
    const input = (
      <editor>
        <block>
          one
          <inline>
            two
            <cursor />
          </inline>
          three
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.insertNodes(
        editor,
        <inline void>
          <text>four</text>
        </inline>
      )
    }
    const output = (
      <editor>
        <block>
          one
          <inline>
            two
            <inline void>
              four
              <cursor />
            </inline>
            <text />
          </inline>
          three
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertNodes-voids-true-block', () => {
    const input = (
      <editor>
        <block void>
          one
          <cursor />
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.insertNodes(editor, <text>two</text>, {
        at: [0, 1],
        voids: true,
      })
    }
    const output = (
      <editor>
        <block void>
          one
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

  test('insertNodes-voids-true-inline', () => {
    const input = (
      <editor>
        <block>
          one
          <inline void>
            two
            <cursor />
          </inline>
          three
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.insertNodes(editor, <text>four</text>, {
        at: [0, 1, 1],
        voids: true,
      })
    }
    const output = (
      <editor>
        <block>
          one
          <inline void>
            two
            <cursor />
            four
          </inline>
          three
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })
})
