/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { Transforms } from 'slate'
import { jsx } from '../jsx'
import { cloneDeep } from 'lodash'
import { withTest } from '../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('delete', () => {
  test('delete-emojis-inline-end-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'character', reverse: true })
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            word🇫🇷
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
          <inline>
            word
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

  test('delete-emojis-inline-middle-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'character', reverse: true })
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            wor📛
            <cursor />d
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
            wor
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

  test('delete-emojis-inline-middle', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'character' })
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            wo
            <cursor />
            📛rd
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

  test('delete-emojis-inline-only-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'character', reverse: true })
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            📛
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
          <inline>
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

  test('delete-emojis-inline-start', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'character' })
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            <cursor />
            📛word
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

  test('delete-emojis-text-end-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'character', reverse: true })
    }
    const input = (
      <editor>
        <block>
          word📛
          <cursor />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          word
          <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-emojis-text-start', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'character' })
    }
    const input = (
      <editor>
        <block>
          <cursor />
          📛word
        </block>
      </editor>
    )
    const output = (
      <editor>
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

  test('delete-path-block', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const run = editor => {
      Transforms.delete(editor, { at: [1] })
    }
    const output = (
      <editor>
        <block>one</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-path-inline', () => {
    const input = (
      <editor>
        <block>
          <text />
          <inline>one</inline>
          <text />
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.delete(editor, { at: [0, 1] })
    }
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

  test('delete-path-selection-inside', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>
          <text>
            t<cursor />
            wo
          </text>
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.delete(editor, { at: [1, 0] })
    }
    const output = (
      <editor>
        <block>
          one
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

  test('delete-path-text', () => {
    const run = editor => {
      Transforms.delete(editor, { at: [0, 0] })
    }
    const input = (
      <editor>
        <block>
          <text>one</text>
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

  test('delete-point-basic-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, { reverse: true })
    }
    const input = (
      <editor>
        <block>one</block>
        <block>
          <cursor />
          two
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
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

  test('delete-point-basic', () => {
    const run = editor => {
      Transforms.delete(editor)
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
        <block>
          word
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

  test('delete-point-depths-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, { reverse: true })
    }
    const input = (
      <editor>
        <block>Hello</block>
        <block>
          <block>
            <cursor />
            world!
          </block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          Hello
          <cursor />
          world!
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-point-inline-before-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, { reverse: true })
    }
    const input = (
      <editor>
        <block>one</block>
        <block>
          <cursor />
          two
          <inline>three</inline>
          four
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one
          <cursor />
          two
          <inline>three</inline>
          four
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-point-inline-before', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          word
          <cursor />
        </block>
        <block>
          <text />
          <inline void>
            <text />
          </inline>
          <text />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          word
          <cursor />
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

  test('delete-point-inline-end', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          one
          <inline>
            two
            <cursor />
          </inline>
          <text />
        </block>
        <block>
          <text />
          <inline>three</inline>
          four
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one
          <inline>two</inline>
          <text>
            <cursor />
          </text>
          <inline>three</inline>
          four
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-point-inline-inside-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, { reverse: true })
    }
    const input = (
      <editor>
        <block>
          one
          <inline>two</inline>
          <text />
        </block>
        <block>
          <text />
          <inline>
            <cursor />
            three
          </inline>
          four
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one
          <inline>two</inline>
          <text>
            <cursor />
          </text>
          <inline>three</inline>
          four
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-point-inline-void-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, { reverse: true })
    }
    const input = (
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
          word
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text />
          <inline void>
            <text>
              <cursor />
            </text>
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

  test('delete-point-inline-void', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          word
          <cursor />
        </block>
        <block>
          <text />
          <inline void>
            <text />
          </inline>
          <text />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          word
          <cursor />
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

  test('delete-point-inline', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          one
          <cursor />
        </block>
        <block>
          two<inline>three</inline>four
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one
          <cursor />
          two<inline>three</inline>four
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-point-nested-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, { reverse: true })
    }
    const input = (
      <editor>
        <block>
          <block>word</block>
          <block>
            <cursor />
            another
          </block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <block>
            word
            <cursor />
            another
          </block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-point-nested', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          <block>
            word
            <cursor />
          </block>
          <block>another</block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <block>
            word
            <cursor />
            another
          </block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-selection-block-across-multiple', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          <anchor />
          one
        </block>
        <block>two</block>
        <block>three</block>
        <block>
          four
          <focus />
        </block>
      </editor>
    )
    const output = (
      <editor>
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

  test('delete-selection-block-across-nested', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          <block>
            one
            <anchor />
          </block>
          <block>two</block>
        </block>
        <block>
          <block>
            <focus />
            three
          </block>
          <block>four</block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <block>
            one
            <cursor />
            three
          </block>
        </block>
        <block>
          <block>four</block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-selection-block-across', () => {
    const run = editor => {
      Transforms.delete(editor)
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
        <block>
          wo
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

  test('delete-selection-block-depths-nested', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          <block>
            one
            <anchor />
          </block>
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
          <block>
            one
            <cursor />
            two
          </block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-selection-block-depths', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          wo
          <anchor />
          rd
        </block>
        <block>
          <block>middle</block>
          <block>
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
          wo
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

  test('delete-selection-block-hanging-multiple', () => {
    const run = editor => {
      Transforms.delete(editor)
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
          <cursor />
        </block>
        <block>three</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-selection-block-hanging-single', () => {
    const run = editor => {
      Transforms.delete(editor)
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

  test('delete-selection-block-inline-across', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
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
    const output = (
      <editor>
        <block>
          <text />
          <inline>wo</inline>
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

  test('delete-selection-block-inline-over', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>one</block>
        <block>
          t<anchor />
          wo<inline>three</inline>fou
          <focus />r
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>one</block>
        <block>
          t<cursor />r
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-selection-block-join-edges', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          word
          <anchor />
        </block>
        <block>
          <focus />
          another
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          word
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

  test('delete-selection-block-join-inline', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          one
          <anchor />
        </block>
        <block>
          <focus />
          two<inline>three</inline>four
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one
          <cursor />
          two<inline>three</inline>four
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-selection-block-join-nested', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          <block>
            <block>
              word
              <anchor />
            </block>
            <block>
              <focus />
              another
            </block>
          </block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <block>
            <block>
              word
              <cursor />
              another
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

  test('delete-selection-block-middle', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>one</block>
        <block>
          t<anchor />w<focus />o
        </block>
        <block>three</block>
      </editor>
    )
    const output = (
      <editor>
        <block>one</block>
        <block>
          t<cursor />o
        </block>
        <block>three</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-selection-block-nested', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          <block>
            <anchor />
            one
          </block>
          <block>
            <block>two</block>
            <block>
              <block>
                three
                <focus />
              </block>
            </block>
          </block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <block>
            <cursor />
          </block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-selection-block-void-end-hanging', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          <anchor />
          This is a first paragraph
        </block>
        <block>This is the second paragraph</block>
        <block void />
        <block>
          <focus />
        </block>
      </editor>
    )
    const output = (
      <editor>
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

  test('delete-selection-block-void-end', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          <anchor />
          This is a first paragraph
        </block>
        <block>This is the second paragraph</block>
        <block void>
          <focus />
        </block>
      </editor>
    )
    const output = (
      <editor>
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

  test('delete-selection-character-end', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          wor
          <anchor />d<focus />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          wor
          <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-selection-character-middle', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          w<anchor />o<focus />
          rd
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          w<cursor />
          rd
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-selection-character-start', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          <anchor />w<focus />
          ord
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
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

  test('delete-selection-inline-after', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          one<inline>two</inline>
          <anchor />a<focus />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one<inline>two</inline>
          <text>
            <cursor />
          </text>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-selection-inline-inside', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            wo
            <anchor />r<focus />d
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

  test('delete-selection-inline-over', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          o<anchor />
          ne<inline>two</inline>thre
          <focus />e
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          o<cursor />e
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-selection-inline-whole', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            <anchor />
            word
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
          <inline>
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

  test('delete-selection-word', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          <anchor />
          word
          <focus />
        </block>
      </editor>
    )
    const output = (
      <editor>
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

  test('delete-unit-character-document-end', () => {
    const run = editor => {
      Transforms.delete(editor)
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
          <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-unit-character-document-start-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'character', reverse: true })
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

  test('delete-unit-character-empty-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, { reverse: true })
    }
    const input = (
      <editor>
        <block>
          <cursor />
        </block>
      </editor>
    )
    const output = (
      <editor>
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

  test('delete-unit-character-empty', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          <cursor />
        </block>
      </editor>
    )
    const output = (
      <editor>
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

  test('delete-unit-character-end', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'character' })
    }
    const input = (
      <editor>
        <block>
          wor
          <cursor />d
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          wor
          <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-unit-character-first-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'character', reverse: true })
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

  test('delete-unit-character-first', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'character' })
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

  test('delete-unit-character-inline-after-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'character', reverse: true })
    }
    const input = (
      <editor>
        <block>
          one
          <inline>two</inline>
          a<cursor />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one
          <inline>two</inline>
          <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-unit-character-inline-after', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          one
          <inline>two</inline>
          <cursor />a
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one
          <inline>two</inline>
          <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-unit-character-inline-before-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'character', reverse: true })
    }
    const input = (
      <editor>
        <block>
          a<cursor />
          <inline>two</inline>
          three
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <cursor />
          <inline>two</inline>
          three
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-unit-character-inline-before', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'character' })
    }
    const input = (
      <editor>
        <block>
          a<cursor />
          <inline>two</inline>
          three
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          a
          <inline>
            <cursor />
            wo
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

  test('delete-unit-character-inline-end-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'character', reverse: true })
    }
    const input = (
      <editor>
        <block>
          one
          <inline>two</inline>
          <cursor />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one
          <inline>
            tw
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

  test('delete-unit-character-inline-inside-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'character', reverse: true })
    }
    const input = (
      <editor>
        <block>
          one
          <inline>
            a<cursor />
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

  test('delete-unit-character-inline-inside', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          one
          <inline>
            <cursor />a
          </inline>
          two
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one
          <inline>
            <cursor />
          </inline>
          two
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-unit-character-last', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'character' })
    }
    const input = (
      <editor>
        <block>
          wor
          <cursor />d
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          wor
          <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-unit-character-middle-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'character', reverse: true })
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
          w<cursor />
          rd
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-unit-character-middle', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'character' })
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
          <cursor />d
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-unit-character-multiple-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, {
        unit: 'character',
        distance: 3,
        reverse: true,
      })
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
          w<cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-unit-character-multiple', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'character', distance: 3 })
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
          <cursor />d
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-unit-line-text-end-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'line', reverse: true })
    }
    const input = (
      <editor>
        <block>
          one two three
          <cursor />
        </block>
      </editor>
    )
    const output = (
      <editor>
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

  test('delete-unit-line-text-end', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'line' })
    }
    const input = (
      <editor>
        <block>
          one two three
          <cursor />
        </block>
      </editor>
    )
    const output = cloneDeep(input)

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-unit-line-text-middle-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'line', reverse: true })
    }
    const input = (
      <editor>
        <block>
          one two thr
          <cursor />
          ee
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <cursor />
          ee
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-unit-line-text-middle', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'line' })
    }
    const input = (
      <editor>
        <block>
          one two thr
          <cursor />
          ee
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one two thr
          <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-unit-line-text-start-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'line', reverse: true })
    }
    const input = (
      <editor>
        <block>
          <cursor />
          one two three
        </block>
      </editor>
    )
    const output = cloneDeep(input)

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-unit-line-text-start', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'line' })
    }
    const input = (
      <editor>
        <block>
          <cursor />
          one two three
        </block>
      </editor>
    )
    const output = (
      <editor>
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

  test('delete-unit-word-block-join-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'word', reverse: true })
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
        <block>
          word
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

  test('delete-unit-word-block-join', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'word' })
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
        <block>
          word
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

  test('delete-unit-word-text-end-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'word', reverse: true })
    }
    const input = (
      <editor>
        <block>
          one two three
          <cursor />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one two <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-unit-word-text-middle-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'word', reverse: true })
    }
    const input = (
      <editor>
        <block>
          one two thr
          <cursor />
          ee
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one two <cursor />
          ee
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-unit-word-text-middle', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'word' })
    }
    const input = (
      <editor>
        <block>
          o<cursor />
          ne two three
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          o<cursor /> two three
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-unit-word-text-start', () => {
    const run = editor => {
      Transforms.delete(editor, { unit: 'word' })
    }
    const input = (
      <editor>
        <block>
          <cursor />
          one two three
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <cursor /> two three
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-voids-false-block-across-backward', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block void>
          <focus />
        </block>
        <block>one</block>
        <block>
          two
          <anchor />
        </block>
      </editor>
    )
    const output = (
      <editor>
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

  test('delete-voids-false-block-after-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, { reverse: true })
    }
    const input = (
      <editor>
        <block void>
          <text />
        </block>
        <block>
          <cursor />
        </block>
      </editor>
    )
    const output = (
      <editor>
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

  test('delete-voids-false-block-before', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          <cursor />
        </block>
        <block void>
          <text />
        </block>
      </editor>
    )
    const output = (
      <editor>
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

  test('delete-voids-false-block-both', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block void>
          <anchor />
        </block>
        <block void>
          <focus />
        </block>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <cursor />
          one
        </block>
        <block>two</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-voids-false-block-end', () => {
    const run = editor => {
      Transforms.delete(editor)
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

  test('delete-voids-false-block-hanging-from', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block void>
          <anchor />
        </block>
        <block>
          <focus />
          one
        </block>
        <block>two</block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <cursor />
          one
        </block>
        <block>two</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-voids-false-block-hanging-into', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          <anchor />
          one
        </block>
        <block void>
          <focus />
          two
        </block>
        <block>three</block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <cursor />
        </block>
        <block>three</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-voids-false-block-only', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block void>
          <cursor />
        </block>
      </editor>
    )
    const output = <editor />

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-voids-false-block-start-multiple', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block void>
          <anchor />
        </block>
        <block void>
          <text />
        </block>
        <block>
          <focus />
          one
        </block>
        <block>two</block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <cursor />
          one
        </block>
        <block>two</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-voids-false-block-start', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block void>
          <anchor />
        </block>
        <block>one</block>
        <block>
          tw
          <focus />o
        </block>
        <block>three</block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <cursor />o
        </block>
        <block>three</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-voids-false-inline-after-reverse', () => {
    const run = editor => {
      Transforms.delete(editor, { reverse: true })
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline void>
            <text />
          </inline>
          <cursor />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text>
            <cursor />
          </text>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-voids-false-inline-before', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          <text>
            <cursor />
          </text>
          <inline void>
            <text />
          </inline>
          <text />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text>
            <cursor />
          </text>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-voids-false-inline-into', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          <anchor />
          one
          <inline>
            t<focus />
            wo
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
            <cursor />
            wo
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

  test.skip('delete-voids-false-inline-over', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          <anchor />
          one
        </block>
        <block>two</block>
        <block>
          three
          <inline void>four</inline>
          <focus />
          five
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <cursor />
          five
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-voids-false-inline-start-across', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          one
          <inline void>
            <anchor />
          </inline>
          two
        </block>
        <block>
          three <focus />
        </block>
      </editor>
    )
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

  test('delete-voids-false-inline-start', () => {
    const run = editor => {
      Transforms.delete(editor)
    }
    const input = (
      <editor>
        <block>
          one
          <inline void>
            <anchor />
          </inline>
          <focus />
          two
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
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

  test('delete-voids-true-across-blocks', () => {
    const input = (
      <editor>
        <block void>
          <text>
            on
            <anchor />e
          </text>
        </block>
        <block void>
          <text>
            t<focus />
            wo
          </text>
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.delete(editor, { voids: true })
    }
    const output = (
      <editor>
        <block void>
          on
          <cursor />
          wo
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('delete-voids-true-path', () => {
    const input = (
      <editor>
        <block void>
          <text>one</text>
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.delete(editor, { at: [0, 0], voids: true })
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
})
