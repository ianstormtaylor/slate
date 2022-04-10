/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import assert from 'assert'
import { Editor, Transforms, Operation, Text } from 'slate'
import { jsx } from '../jsx'
import _ from 'lodash'
import { withTest } from '../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('setNodes', () => {
  test('setNodes-basic-structure-can-be-serialized', () => {
    const run = (editor: Editor) => {
      Transforms.setNodes(editor, { someKey: true }, { at: [0] })
      const [op] = editor.operations
      const roundTrip: Operation = JSON.parse(JSON.stringify(op))
      assert.deepStrictEqual(op, roundTrip)
    }
    const input = (
      <editor>
        <block>
          <text />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block someKey>
          <text />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('setNodes-basic-structure-invert-after-serialization', () => {
    const run = (editor: Editor) => {
      Transforms.setNodes(editor, { key: true }, { at: [0] })
      const [op] = editor.operations
      const roundTrip: Operation = JSON.parse(JSON.stringify(op))
      const inverted = Operation.inverse(roundTrip)
      editor.apply(inverted)
    }
    const input = (
      <editor>
        <block>
          <text />
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

  test('setNodes-block-block-across', () => {
    const run = editor => {
      Transforms.setNodes(
        editor,
        { someKey: true },
        { match: n => Editor.isBlock(editor, n) }
      )
    }
    const input = (
      <editor>
        <block>
          <anchor />
          word
        </block>
        <block>
          a<focus />
          nother
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block someKey>
          <anchor />
          word
        </block>
        <block someKey>
          a<focus />
          nother
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('setNodes-block-block-hanging', () => {
    const run = editor => {
      Transforms.setNodes(
        editor,
        { someKey: true },
        { match: n => Editor.isBlock(editor, n) }
      )
    }
    const input = (
      <editor>
        <block>
          <anchor />
          word
        </block>
        <block>
          <focus />
          another
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block someKey>
          <anchor />
          word
        </block>
        <block>
          <focus />
          another
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('setNodes-block-block-nested', () => {
    const run = editor => {
      Transforms.setNodes(
        editor,
        { someKey: true },
        { match: n => Editor.isBlock(editor, n) }
      )
    }
    const input = (
      <editor>
        <block>
          <block>
            <cursor />
            word
          </block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <block someKey>
            <cursor />
            word
          </block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('setNodes-block-block-void', () => {
    const run = editor => {
      Transforms.setNodes(
        editor,
        { someKey: true },
        { match: n => Editor.isBlock(editor, n) }
      )
    }
    const input = (
      <editor>
        <block void>
          <cursor />
          word
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block void someKey>
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

  test('setNodes-block-block', () => {
    const run = editor => {
      Transforms.setNodes(
        editor,
        { someKey: true },
        { match: n => Editor.isBlock(editor, n) }
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
        <block someKey>
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

  test('setNodes-inline-inline-across', () => {
    const run = editor => {
      Transforms.setNodes(
        editor,
        { someKey: true },
        { match: n => Editor.isInline(editor, n) }
      )
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            <anchor />
            word
          </inline>
          <text />
        </block>
        <block>
          <text />
          <inline>
            another
            <focus />
          </inline>
          <text />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text />
          <inline someKey>
            <anchor />
            word
          </inline>
          <text />
        </block>
        <block>
          <text />
          <inline someKey>
            another
            <focus />
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

  test('setNodes-inline-inline-block-hanging', () => {
    const run = editor => {
      Transforms.setNodes(
        editor,
        { someKey: true },
        { match: n => Editor.isInline(editor, n) }
      )
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            <anchor />
            word
          </inline>
          <text />
        </block>
        <block>
          <text />
          <inline>
            <focus />
            another
          </inline>
          <text />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text />
          <inline someKey>
            <anchor />
            word
          </inline>
          <text />
        </block>
        <block>
          <text />
          <inline>
            <focus />
            another
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

  test('setNodes-inline-inline-hanging', () => {
    const run = editor => {
      Transforms.setNodes(
        editor,
        { someKey: true },
        { match: n => Editor.isInline(editor, n) }
      )
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            <anchor />
            word
          </inline>
          <focus />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text />
          <inline someKey>
            <anchor />
            word
          </inline>
          <focus />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('setNodes-inline-inline-nested', () => {
    const run = editor => {
      Transforms.setNodes(
        editor,
        { someKey: true },
        { match: n => Editor.isInline(editor, n) }
      )
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            <text />
            <inline>
              <cursor />
              word
            </inline>
            <text />
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
            <inline someKey>
              <cursor />
              word
            </inline>
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

  test('setNodes-inline-inline-void', () => {
    const run = editor => {
      Transforms.setNodes(
        editor,
        { someKey: true },
        { match: n => Editor.isInline(editor, n) }
      )
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline void>
            <cursor />
            word
          </inline>
          <text />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text />
          <inline void someKey>
            <cursor />
            word
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

  test('setNodes-inline-inline', () => {
    const run = editor => {
      Transforms.setNodes(
        editor,
        { someKey: true },
        { match: n => Editor.isInline(editor, n) }
      )
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            <cursor />
            word
          </inline>
          <text />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text />
          <inline someKey>
            <cursor />
            word
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

  test('setNodes-merge-text', () => {
    const run = editor => {
      Transforms.setNodes(
        editor,
        { a: { b: 2, c: 3 } },
        {
          at: [0, 0],
          match: Text.isText,
          merge: (n, p) => _.defaultsDeep(p, n),
        }
      )
    }
    const input = (
      <editor>
        <block>
          <text a={{ b: 1 }}>word</text>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text a={{ b: 2, c: 3 }}>word</text>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('setNodes-path-block', () => {
    const input = (
      <editor>
        <block>word</block>
      </editor>
    )
    const run = editor => {
      Transforms.setNodes(editor, { key: 'a' }, { at: [0] })
    }
    const output = (
      <editor>
        <block key="a">word</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('setNodes-path-inline', () => {
    const run = editor => {
      Transforms.setNodes(editor, { key: 'a' }, { at: [0, 1] })
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline>word</inline>
          <text />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text />
          <inline key="a">word</inline>
          <text />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('setNodes-path-text', () => {
    const run = editor => {
      Transforms.setNodes(editor, { key: 'a' }, { at: [0, 0] })
    }
    const input = (
      <editor>
        <block>word</block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text key="a">word</text>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('setNodes-split-noop-collapsed', () => {
    const run = editor => {
      Transforms.setNodes(
        editor,
        { someKey: true },
        { match: Text.isText, split: true }
      )
    }
    const input = (
      <editor>
        <block>
          w<cursor />
          ord
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          w<cursor />
          ord
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('setNodes-split-text-remove', () => {
    const run = editor => {
      Transforms.setNodes(
        editor,
        { someKey: null },
        { match: Text.isText, split: true }
      )
    }
    const input = (
      <editor>
        <block>
          <text someKey>
            w<anchor />
            or
            <focus />d
          </text>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text someKey>w</text>
          <text>
            <anchor />
            or
            <focus />
          </text>
          <text someKey>d</text>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('setNodes-split-text', () => {
    const run = editor => {
      Transforms.setNodes(
        editor,
        { someKey: true },
        { match: Text.isText, split: true }
      )
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
        <block>
          <text>w</text>
          <text someKey>
            <anchor />
            or
            <focus />
          </text>
          <text>d</text>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('setNodes-text-block-across', () => {
    const run = editor => {
      Transforms.setNodes(editor, { someKey: true }, { match: Text.isText })
    }
    const input = (
      <editor>
        <block>
          <anchor />
          word
        </block>
        <block>
          a<focus />
          nother
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text someKey>
            <anchor />
            word
          </text>
        </block>
        <block>
          <text someKey>
            a<focus />
            nother
          </text>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('setNodes-text-merge-across', () => {
    const run = editor => {
      Transforms.setNodes(
        editor,
        { someKey: true },
        { match: Text.isText, split: true }
      )
    }
    const input = (
      <editor>
        <block>
          <text>
            One
            <anchor />
          </text>
          <text someKey>Two</text>
          <text>
            <focus />
            Three
          </text>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text>
            One
            <anchor />
          </text>
          <text someKey>
            Two
            <focus />
          </text>
          <text>Three</text>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('setNodes-text-text', () => {
    const run = editor => {
      Transforms.setNodes(editor, { someKey: true }, { match: Text.isText })
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
          <text someKey>
            <cursor />
            word
          </text>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('setNodes-voids-true-block', () => {
    const input = (
      <editor>
        <block void>word</block>
      </editor>
    )
    const run = editor => {
      Transforms.setNodes(
        editor,
        { someKey: true },
        { at: [0, 0], voids: true }
      )
    }
    const output = (
      <editor>
        <block void>
          <text someKey>word</text>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })
})
