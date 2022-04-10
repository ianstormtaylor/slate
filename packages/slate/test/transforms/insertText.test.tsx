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

describe.concurrent('insertText', () => {
  test('insertText-path-block', () => {
    const input = (
      <editor>
        <block>word</block>
      </editor>
    )
    const run = editor => {
      Transforms.insertText(editor, 'x', { at: [0] })
    }
    const output = (
      <editor>
        <block>x</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertText-path-text', () => {
    const input = (
      <editor>
        <block>word</block>
      </editor>
    )
    const run = editor => {
      Transforms.insertText(editor, 'x', { at: [0, 0] })
    }
    const output = (
      <editor>
        <block>x</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertText-point-selection-after', () => {
    const input = (
      <editor>
        <block>
          <text>
            w<anchor />
            or
            <focus />d
          </text>
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.insertText(editor, 'x', { at: { path: [0, 0], offset: 4 } })
    }
    const output = (
      <editor>
        <block>
          w<anchor />
          or
          <focus />
          dx
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertText-point-selection-before', () => {
    const input = (
      <editor>
        <block>
          <text>
            w<anchor />
            or
            <focus />d
          </text>
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.insertText(editor, 'x', { at: { path: [0, 0], offset: 0 } })
    }
    const output = (
      <editor>
        <block>
          xw
          <anchor />
          or
          <focus />d
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertText-point-selection-end', () => {
    const input = (
      <editor>
        <block>
          <text>
            w<anchor />
            or
            <focus />d
          </text>
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.insertText(editor, 'x', { at: { path: [0, 0], offset: 3 } })
    }
    const output = (
      <editor>
        <block>
          w<anchor />
          orx
          <focus />d
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertText-point-selection-middle', () => {
    const input = (
      <editor>
        <block>
          <text>
            w<anchor />
            or
            <focus />d
          </text>
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.insertText(editor, 'x', { at: { path: [0, 0], offset: 2 } })
    }
    const output = (
      <editor>
        <block>
          w<anchor />
          oxr
          <focus />d
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertText-point-selection-start', () => {
    const input = (
      <editor>
        <block>
          <text>
            w<anchor />
            or
            <focus />d
          </text>
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.insertText(editor, 'x', { at: { path: [0, 0], offset: 1 } })
    }
    const output = (
      <editor>
        <block>
          wx
          <anchor />
          or
          <focus />d
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertText-point-text-end', () => {
    const input = (
      <editor>
        <block>
          <text>word</text>
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.insertText(editor, 'x', { at: { path: [0, 0], offset: 4 } })
    }
    const output = (
      <editor>
        <block>wordx</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertText-point-text-middle', () => {
    const input = (
      <editor>
        <block>
          <text>word</text>
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.insertText(editor, 'x', { at: { path: [0, 0], offset: 2 } })
    }
    const output = (
      <editor>
        <block>woxrd</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertText-point-text-start', () => {
    const run = editor => {
      Transforms.insertText(editor, 'x', { at: { path: [0, 0], offset: 0 } })
    }
    const input = (
      <editor>
        <block>
          <text>
            wo
            <cursor />
            rd
          </text>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          xwo
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

  test('insertText-selection-block-across', () => {
    const run = editor => {
      Transforms.insertText(editor, 'a')
    }
    const input = (
      <editor>
        <block>
          <anchor />
          first paragraph
        </block>
        <block>
          second
          <focus /> paragraph
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          a<cursor /> paragraph
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertText-selection-block-end-words', () => {
    const run = editor => {
      Transforms.insertText(editor, ' a few words')
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
          word a few words
          <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertText-selection-block-end', () => {
    const run = editor => {
      Transforms.insertText(editor, 'a')
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
          worda
          <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test.skip('insertText-selection-block-hanging-across', () => {
    const run = editor => {
      Transforms.insertText(editor, 'a')
    }
    const input = (
      <editor>
        <block>
          <anchor />
          one
        </block>
        <block>two</block>
        <block>
          <focus />
          three
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          a<cursor />
          three
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test.skip('insertText-selection-block-hanging', () => {
    const run = editor => {
      Transforms.insertText(editor, 'a')
    }
    const input = (
      <editor>
        <block>
          <anchor />
          one
        </block>
        <block>
          <focus />
          two
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          a<cursor />
        </block>
        <block>two</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertText-selection-block-middle-words', () => {
    const run = editor => {
      Transforms.insertText(editor, ' a few words ')
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
          w a few words <cursor />
          ord
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertText-selection-block-middle', () => {
    const run = editor => {
      Transforms.insertText(editor, 'a')
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
          wa
          <cursor />
          ord
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertText-selection-block-start-words', () => {
    const run = editor => {
      Transforms.insertText(editor, 'a few words')
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
          a few words
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

  test('insertText-selection-block-start', () => {
    const run = editor => {
      Transforms.insertText(editor, 'a')
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
          a<cursor />
          word
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertText-selection-block-void', () => {
    const run = editor => {
      Transforms.insertText(editor, 'a')
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

  test('insertText-selection-inline-end', () => {
    const run = editor => {
      editor.insertText('four')
    }
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
    const output = (
      <editor>
        <block>
          one
          <inline>
            twofour
            <cursor />
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

  test('insertText-voids-false-block', () => {
    const input = (
      <editor>
        <block void>word</block>
      </editor>
    )
    const run = editor => {
      Transforms.insertText(editor, 'x', { at: [0] })
    }
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

  test('insertText-voids-false-text', () => {
    const input = (
      <editor>
        <block void>word</block>
      </editor>
    )
    const run = editor => {
      Transforms.insertText(editor, 'x', { at: [0, 0] })
    }
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

  test('insertText-voids-true-block', () => {
    const input = (
      <editor>
        <block void>word</block>
      </editor>
    )
    const run = editor => {
      Transforms.insertText(editor, 'x', { at: [0], voids: true })
    }
    const output = (
      <editor>
        <block void>x</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertText-voids-true-text', () => {
    const input = (
      <editor>
        <block void>word</block>
      </editor>
    )
    const run = editor => {
      Transforms.insertText(editor, 'x', { at: [0, 0], voids: true })
    }
    const output = (
      <editor>
        <block void>x</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })
})
