/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../jsx'
import { withTest } from '../../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('positions', () => {
  test('positions-all-block-multiple-reverse', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
        <block>three</block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { at: [], reverse: true }))
    }
    const output = [
      { path: [2, 0], offset: 5 },
      { path: [2, 0], offset: 4 },
      { path: [2, 0], offset: 3 },
      { path: [2, 0], offset: 2 },
      { path: [2, 0], offset: 1 },
      { path: [2, 0], offset: 0 },
      { path: [1, 0], offset: 3 },
      { path: [1, 0], offset: 2 },
      { path: [1, 0], offset: 1 },
      { path: [1, 0], offset: 0 },
      { path: [0, 0], offset: 3 },
      { path: [0, 0], offset: 2 },
      { path: [0, 0], offset: 1 },
      { path: [0, 0], offset: 0 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-all-block-multiple', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
        <block>three</block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { at: [] }))
    }
    const output = [
      { path: [0, 0], offset: 0 },
      { path: [0, 0], offset: 1 },
      { path: [0, 0], offset: 2 },
      { path: [0, 0], offset: 3 },
      { path: [1, 0], offset: 0 },
      { path: [1, 0], offset: 1 },
      { path: [1, 0], offset: 2 },
      { path: [1, 0], offset: 3 },
      { path: [2, 0], offset: 0 },
      { path: [2, 0], offset: 1 },
      { path: [2, 0], offset: 2 },
      { path: [2, 0], offset: 3 },
      { path: [2, 0], offset: 4 },
      { path: [2, 0], offset: 5 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-all-block-nested', () => {
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
    const test = editor => {
      return Array.from(Editor.positions(editor, { at: [] }))
    }
    const output = [
      { path: [0, 0, 0], offset: 0 },
      { path: [0, 0, 0], offset: 1 },
      { path: [0, 0, 0], offset: 2 },
      { path: [0, 0, 0], offset: 3 },
      { path: [1, 0, 0], offset: 0 },
      { path: [1, 0, 0], offset: 1 },
      { path: [1, 0, 0], offset: 2 },
      { path: [1, 0, 0], offset: 3 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-all-block-reverse', () => {
    const input = (
      <editor>
        <block>one</block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { at: [], reverse: true }))
    }
    const output = [
      { path: [0, 0], offset: 3 },
      { path: [0, 0], offset: 2 },
      { path: [0, 0], offset: 1 },
      { path: [0, 0], offset: 0 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-all-block', () => {
    const input = (
      <editor>
        <block>one</block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { at: [] }))
    }
    const output = [
      { path: [0, 0], offset: 0 },
      { path: [0, 0], offset: 1 },
      { path: [0, 0], offset: 2 },
      { path: [0, 0], offset: 3 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-all-inline-fragmentation-empty-text', () => {
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            <text />
            <inline>
              <text />
            </inline>
            <text />
          </inline>
          <text />
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { at: [] }))
    }
    const output = [
      { path: [0, 0], offset: 0 },
      { path: [0, 1, 0], offset: 0 },
      { path: [0, 1, 1, 0], offset: 0 },
      { path: [0, 1, 2], offset: 0 },
      { path: [0, 2], offset: 0 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-all-inline-fragmentation-reverse', () => {
    const input = (
      <editor>
        <block>
          1<inline>2</inline>3
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { at: [], reverse: true }))
    }

    const output = [
      { path: [0, 2], offset: 1 },
      { path: [0, 2], offset: 0 },
      { path: [0, 1, 0], offset: 1 },
      { path: [0, 1, 0], offset: 0 },
      { path: [0, 0], offset: 1 },
      { path: [0, 0], offset: 0 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-all-inline-fragmentation', () => {
    const input = (
      <editor>
        <block>
          1<inline>2</inline>3
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { at: [] }))
    }

    const output = [
      { path: [0, 0], offset: 0 },
      { path: [0, 0], offset: 1 },
      { path: [0, 1, 0], offset: 0 },
      { path: [0, 1, 0], offset: 1 },
      { path: [0, 2], offset: 0 },
      { path: [0, 2], offset: 1 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-all-inline-multiple', () => {
    const input = (
      <editor>
        <block>
          one<inline>two</inline>three<inline>four</inline>five
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { at: [] }))
    }
    const output = [
      { path: [0, 0], offset: 0 },
      { path: [0, 0], offset: 1 },
      { path: [0, 0], offset: 2 },
      { path: [0, 0], offset: 3 },
      { path: [0, 1, 0], offset: 0 },
      { path: [0, 1, 0], offset: 1 },
      { path: [0, 1, 0], offset: 2 },
      { path: [0, 1, 0], offset: 3 },
      { path: [0, 2], offset: 0 },
      { path: [0, 2], offset: 1 },
      { path: [0, 2], offset: 2 },
      { path: [0, 2], offset: 3 },
      { path: [0, 2], offset: 4 },
      { path: [0, 2], offset: 5 },
      { path: [0, 3, 0], offset: 0 },
      { path: [0, 3, 0], offset: 1 },
      { path: [0, 3, 0], offset: 2 },
      { path: [0, 3, 0], offset: 3 },
      { path: [0, 3, 0], offset: 4 },
      { path: [0, 4], offset: 0 },
      { path: [0, 4], offset: 1 },
      { path: [0, 4], offset: 2 },
      { path: [0, 4], offset: 3 },
      { path: [0, 4], offset: 4 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-all-inline-nested', () => {
    const input = (
      <editor>
        <block>
          one
          <inline>
            two<inline>three</inline>four
          </inline>
          five
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { at: [] }))
    }
    const output = [
      { path: [0, 0], offset: 0 },
      { path: [0, 0], offset: 1 },
      { path: [0, 0], offset: 2 },
      { path: [0, 0], offset: 3 },
      { path: [0, 1, 0], offset: 0 },
      { path: [0, 1, 0], offset: 1 },
      { path: [0, 1, 0], offset: 2 },
      { path: [0, 1, 0], offset: 3 },
      { path: [0, 1, 1, 0], offset: 0 },
      { path: [0, 1, 1, 0], offset: 1 },
      { path: [0, 1, 1, 0], offset: 2 },
      { path: [0, 1, 1, 0], offset: 3 },
      { path: [0, 1, 1, 0], offset: 4 },
      { path: [0, 1, 1, 0], offset: 5 },
      { path: [0, 1, 2], offset: 0 },
      { path: [0, 1, 2], offset: 1 },
      { path: [0, 1, 2], offset: 2 },
      { path: [0, 1, 2], offset: 3 },
      { path: [0, 1, 2], offset: 4 },
      { path: [0, 2], offset: 0 },
      { path: [0, 2], offset: 1 },
      { path: [0, 2], offset: 2 },
      { path: [0, 2], offset: 3 },
      { path: [0, 2], offset: 4 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-all-inline-normalized', () => {
    const input = (
      <editor>
        <block>
          <text />
          <inline>o</inline>
          <text />
        </block>
      </editor>
    )

    const test = editor => {
      return Array.from(
        Editor.positions(editor, {
          at: Editor.range(editor, []),
          unit: 'character',
        })
      )
    }

    // this is the output but it's incorrect.
    // there should be two positions, before the character and after the character
    const output = [
      { path: [0, 0], offset: 0 },
      { path: [0, 1, 0], offset: 1 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-all-inline-reverse', () => {
    const input = (
      <editor>
        <block>
          one<inline>two</inline>three
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { at: [], reverse: true }))
    }
    const output = [
      { path: [0, 2], offset: 5 },
      { path: [0, 2], offset: 4 },
      { path: [0, 2], offset: 3 },
      { path: [0, 2], offset: 2 },
      { path: [0, 2], offset: 1 },
      { path: [0, 2], offset: 0 },
      { path: [0, 1, 0], offset: 3 },
      { path: [0, 1, 0], offset: 2 },
      { path: [0, 1, 0], offset: 1 },
      { path: [0, 1, 0], offset: 0 },
      { path: [0, 0], offset: 3 },
      { path: [0, 0], offset: 2 },
      { path: [0, 0], offset: 1 },
      { path: [0, 0], offset: 0 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-all-inline', () => {
    const input = (
      <editor>
        <block>
          one<inline>two</inline>three
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { at: [] }))
    }
    const output = [
      { path: [0, 0], offset: 0 },
      { path: [0, 0], offset: 1 },
      { path: [0, 0], offset: 2 },
      { path: [0, 0], offset: 3 },
      { path: [0, 1, 0], offset: 0 },
      { path: [0, 1, 0], offset: 1 },
      { path: [0, 1, 0], offset: 2 },
      { path: [0, 1, 0], offset: 3 },
      { path: [0, 2], offset: 0 },
      { path: [0, 2], offset: 1 },
      { path: [0, 2], offset: 2 },
      { path: [0, 2], offset: 3 },
      { path: [0, 2], offset: 4 },
      { path: [0, 2], offset: 5 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-all-unit-block-reverse', () => {
    const input = (
      <editor>
        <block>one two three</block>
        <block>four five six</block>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.positions(editor, { at: [], unit: 'block', reverse: true })
      )
    }
    const output = [
      { path: [1, 0], offset: 13 },
      { path: [1, 0], offset: 0 },
      { path: [0, 0], offset: 13 },
      { path: [0, 0], offset: 0 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-all-unit-block', () => {
    const input = (
      <editor>
        <block>one two three</block>
        <block>four five six</block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { at: [], unit: 'block' }))
    }
    const output = [
      { path: [0, 0], offset: 0 },
      { path: [0, 0], offset: 13 },
      { path: [1, 0], offset: 0 },
      { path: [1, 0], offset: 13 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-all-unit-character-inline-fragmentation-multibyte', () => {
    const input = (
      <editor>
        <block>
          😀<inline>😀</inline>😀
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { at: [], unit: 'character' }))
    }

    const output = [
      { path: [0, 0], offset: 0 },
      { path: [0, 0], offset: 2 },
      { path: [0, 1, 0], offset: 2 },
      { path: [0, 2], offset: 2 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-all-unit-character-inline-fragmentation-reverse', () => {
    const input = (
      <editor>
        <block>
          1<inline>2</inline>3
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.positions(editor, { at: [], unit: 'character', reverse: true })
      )
    }

    const output = [
      { path: [0, 2], offset: 1 },
      { path: [0, 2], offset: 0 },
      { path: [0, 1, 0], offset: 0 },
      { path: [0, 0], offset: 0 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-all-unit-character-inline-fragmentation', () => {
    const input = (
      <editor>
        <block>
          1<inline>2</inline>3
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { at: [], unit: 'character' }))
    }

    const output = [
      { path: [0, 0], offset: 0 },
      { path: [0, 0], offset: 1 },
      { path: [0, 1, 0], offset: 1 },
      { path: [0, 2], offset: 1 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-all-unit-character-reverse', () => {
    const input = (
      <editor>
        <block>
          one<inline>two</inline>three
        </block>
        <block>
          four<inline>five</inline>six
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.positions(editor, { at: [], unit: 'character', reverse: true })
      )
    }
    const output = [
      { path: [1, 2], offset: 3 },
      { path: [1, 2], offset: 2 },
      { path: [1, 2], offset: 1 },
      { path: [1, 2], offset: 0 },
      { path: [1, 1, 0], offset: 3 },
      { path: [1, 1, 0], offset: 2 },
      { path: [1, 1, 0], offset: 1 },
      { path: [1, 1, 0], offset: 0 },
      { path: [1, 0], offset: 3 },
      { path: [1, 0], offset: 2 },
      { path: [1, 0], offset: 1 },
      { path: [1, 0], offset: 0 },
      { path: [0, 2], offset: 5 },
      { path: [0, 2], offset: 4 },
      { path: [0, 2], offset: 3 },
      { path: [0, 2], offset: 2 },
      { path: [0, 2], offset: 1 },
      { path: [0, 2], offset: 0 },
      { path: [0, 1, 0], offset: 2 },
      { path: [0, 1, 0], offset: 1 },
      { path: [0, 1, 0], offset: 0 },
      { path: [0, 0], offset: 2 },
      { path: [0, 0], offset: 1 },
      { path: [0, 0], offset: 0 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-all-unit-character', () => {
    const input = (
      <editor>
        <block>
          one<inline>two</inline>three
        </block>
        <block>
          four<inline>five</inline>six
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { at: [], unit: 'character' }))
    }
    const output = [
      { path: [0, 0], offset: 0 },
      { path: [0, 0], offset: 1 },
      { path: [0, 0], offset: 2 },
      { path: [0, 0], offset: 3 },
      { path: [0, 1, 0], offset: 1 },
      { path: [0, 1, 0], offset: 2 },
      { path: [0, 1, 0], offset: 3 },
      { path: [0, 2], offset: 1 },
      { path: [0, 2], offset: 2 },
      { path: [0, 2], offset: 3 },
      { path: [0, 2], offset: 4 },
      { path: [0, 2], offset: 5 },
      { path: [1, 0], offset: 0 },
      { path: [1, 0], offset: 1 },
      { path: [1, 0], offset: 2 },
      { path: [1, 0], offset: 3 },
      { path: [1, 0], offset: 4 },
      { path: [1, 1, 0], offset: 1 },
      { path: [1, 1, 0], offset: 2 },
      { path: [1, 1, 0], offset: 3 },
      { path: [1, 1, 0], offset: 4 },
      { path: [1, 2], offset: 1 },
      { path: [1, 2], offset: 2 },
      { path: [1, 2], offset: 3 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-all-unit-line-inline-fragmentation-reverse', () => {
    const input = (
      <editor>
        <block>
          he<inline>ll</inline>o wo<inline>rl</inline>d
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.positions(editor, { at: [], unit: 'line', reverse: true })
      )
    }

    const output = [
      { path: [0, 4], offset: 1 },
      { path: [0, 0], offset: 0 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-all-unit-line-inline-fragmentation', () => {
    const input = (
      <editor>
        <block>
          he<inline>ll</inline>o wo<inline>rl</inline>d
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { at: [], unit: 'line' }))
    }

    const output = [
      { path: [0, 0], offset: 0 },
      { path: [0, 4], offset: 1 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-all-unit-line-reverse', () => {
    const input = (
      <editor>
        <block>one two three</block>
        <block>four five six</block>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.positions(editor, { at: [], unit: 'line', reverse: true })
      )
    }
    const output = [
      { path: [1, 0], offset: 13 },
      { path: [1, 0], offset: 0 },
      { path: [0, 0], offset: 13 },
      { path: [0, 0], offset: 0 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-all-unit-line', () => {
    const input = (
      <editor>
        <block>one two three</block>
        <block>four five six</block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { at: [], unit: 'line' }))
    }
    const output = [
      { path: [0, 0], offset: 0 },
      { path: [0, 0], offset: 13 },
      { path: [1, 0], offset: 0 },
      { path: [1, 0], offset: 13 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-all-unit-word-inline-fragmentation', () => {
    const input = (
      <editor>
        <block>
          he<inline>ll</inline>o wo<inline>rl</inline>d
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { at: [], unit: 'word' }))
    }

    const output = [
      { path: [0, 0], offset: 0 },
      { path: [0, 2], offset: 1 },
      { path: [0, 4], offset: 1 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-all-unit-word-reverse', () => {
    const input = (
      <editor>
        <block>one two three</block>
        <block>four five six</block>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.positions(editor, { at: [], unit: 'word', reverse: true })
      )
    }
    const output = [
      { path: [1, 0], offset: 13 },
      { path: [1, 0], offset: 10 },
      { path: [1, 0], offset: 5 },
      { path: [1, 0], offset: 0 },
      { path: [0, 0], offset: 13 },
      { path: [0, 0], offset: 8 },
      { path: [0, 0], offset: 4 },
      { path: [0, 0], offset: 0 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-all-unit-word', () => {
    const input = (
      <editor>
        <block>one two three</block>
        <block>four five six</block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { at: [], unit: 'word' }))
    }
    const output = [
      { path: [0, 0], offset: 0 },
      { path: [0, 0], offset: 3 },
      { path: [0, 0], offset: 7 },
      { path: [0, 0], offset: 13 },
      { path: [1, 0], offset: 0 },
      { path: [1, 0], offset: 4 },
      { path: [1, 0], offset: 9 },
      { path: [1, 0], offset: 13 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-path-block-nested', () => {
    const input = (
      <editor>
        <block>
          <block>one</block>
          <block>two</block>
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { at: [0] }))
    }
    const output = [
      { path: [0, 0, 0], offset: 0 },
      { path: [0, 0, 0], offset: 1 },
      { path: [0, 0, 0], offset: 2 },
      { path: [0, 0, 0], offset: 3 },
      { path: [0, 1, 0], offset: 0 },
      { path: [0, 1, 0], offset: 1 },
      { path: [0, 1, 0], offset: 2 },
      { path: [0, 1, 0], offset: 3 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-path-block-reverse', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { reverse: true, at: [0, 0] }))
    }
    const output = [
      { path: [0, 0], offset: 3 },
      { path: [0, 0], offset: 2 },
      { path: [0, 0], offset: 1 },
      { path: [0, 0], offset: 0 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-path-block', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { at: [1, 0] }))
    }
    const output = [
      { path: [1, 0], offset: 0 },
      { path: [1, 0], offset: 1 },
      { path: [1, 0], offset: 2 },
      { path: [1, 0], offset: 3 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-path-inline-nested', () => {
    const input = (
      <editor>
        <block>
          one
          <inline>
            two<inline>three</inline>four
          </inline>
          five
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { at: [0, 1] }))
    }
    const output = [
      { path: [0, 1, 0], offset: 0 },
      { path: [0, 1, 0], offset: 1 },
      { path: [0, 1, 0], offset: 2 },
      { path: [0, 1, 0], offset: 3 },
      { path: [0, 1, 1, 0], offset: 0 },
      { path: [0, 1, 1, 0], offset: 1 },
      { path: [0, 1, 1, 0], offset: 2 },
      { path: [0, 1, 1, 0], offset: 3 },
      { path: [0, 1, 1, 0], offset: 4 },
      { path: [0, 1, 1, 0], offset: 5 },
      { path: [0, 1, 2], offset: 0 },
      { path: [0, 1, 2], offset: 1 },
      { path: [0, 1, 2], offset: 2 },
      { path: [0, 1, 2], offset: 3 },
      { path: [0, 1, 2], offset: 4 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-path-inline-reverse', () => {
    const input = (
      <editor>
        <block>
          one<inline>two</inline>three
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { reverse: true, at: [0, 1] }))
    }
    const output = [
      { path: [0, 1, 0], offset: 3 },
      { path: [0, 1, 0], offset: 2 },
      { path: [0, 1, 0], offset: 1 },
      { path: [0, 1, 0], offset: 0 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-path-inline', () => {
    const input = (
      <editor>
        <block>
          one<inline>two</inline>three
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { at: [0, 1] }))
    }
    const output = [
      { path: [0, 1, 0], offset: 0 },
      { path: [0, 1, 0], offset: 1 },
      { path: [0, 1, 0], offset: 2 },
      { path: [0, 1, 0], offset: 3 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-range-block-reverse', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
        <block>three</block>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.positions(editor, {
          reverse: true,
          at: {
            anchor: { path: [0, 0], offset: 1 },
            focus: { path: [2, 0], offset: 2 },
          },
        })
      )
    }
    const output = [
      { path: [2, 0], offset: 2 },
      { path: [2, 0], offset: 1 },
      { path: [2, 0], offset: 0 },
      { path: [1, 0], offset: 3 },
      { path: [1, 0], offset: 2 },
      { path: [1, 0], offset: 1 },
      { path: [1, 0], offset: 0 },
      { path: [0, 0], offset: 3 },
      { path: [0, 0], offset: 2 },
      { path: [0, 0], offset: 1 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-range-block', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
        <block>three</block>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.positions(editor, {
          at: {
            anchor: { path: [0, 0], offset: 1 },
            focus: { path: [2, 0], offset: 2 },
          },
        })
      )
    }
    const output = [
      { path: [0, 0], offset: 1 },
      { path: [0, 0], offset: 2 },
      { path: [0, 0], offset: 3 },
      { path: [1, 0], offset: 0 },
      { path: [1, 0], offset: 1 },
      { path: [1, 0], offset: 2 },
      { path: [1, 0], offset: 3 },
      { path: [2, 0], offset: 0 },
      { path: [2, 0], offset: 1 },
      { path: [2, 0], offset: 2 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-range-inline', () => {
    const input = (
      <editor>
        <block>
          one<inline>two</inline>three<inline>four</inline>five
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.positions(editor, {
          at: {
            anchor: { path: [0, 0], offset: 2 },
            focus: { path: [0, 4], offset: 2 },
          },
        })
      )
    }
    const output = [
      { path: [0, 0], offset: 2 },
      { path: [0, 0], offset: 3 },
      { path: [0, 1, 0], offset: 0 },
      { path: [0, 1, 0], offset: 1 },
      { path: [0, 1, 0], offset: 2 },
      { path: [0, 1, 0], offset: 3 },
      { path: [0, 2], offset: 0 },
      { path: [0, 2], offset: 1 },
      { path: [0, 2], offset: 2 },
      { path: [0, 2], offset: 3 },
      { path: [0, 2], offset: 4 },
      { path: [0, 2], offset: 5 },
      { path: [0, 3, 0], offset: 0 },
      { path: [0, 3, 0], offset: 1 },
      { path: [0, 3, 0], offset: 2 },
      { path: [0, 3, 0], offset: 3 },
      { path: [0, 3, 0], offset: 4 },
      { path: [0, 4], offset: 0 },
      { path: [0, 4], offset: 1 },
      { path: [0, 4], offset: 2 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-voids-true-block-all-reverse', () => {
    const input = (
      <editor>
        <block void>one</block>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.positions(editor, { at: [], reverse: true, voids: true })
      )
    }
    const output = [
      { path: [0, 0], offset: 3 },
      { path: [0, 0], offset: 2 },
      { path: [0, 0], offset: 1 },
      { path: [0, 0], offset: 0 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-voids-true-block-all', () => {
    const input = (
      <editor>
        <block void>one</block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { at: [], voids: true }))
    }
    const output = [
      { path: [0, 0], offset: 0 },
      { path: [0, 0], offset: 1 },
      { path: [0, 0], offset: 2 },
      { path: [0, 0], offset: 3 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-voids-true-inline-all-reverse', () => {
    const input = (
      <editor>
        <block void>
          one<inline>two</inline>three
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.positions(editor, { at: [], reverse: true, voids: true })
      )
    }
    const output = [
      { path: [0, 2], offset: 5 },
      { path: [0, 2], offset: 4 },
      { path: [0, 2], offset: 3 },
      { path: [0, 2], offset: 2 },
      { path: [0, 2], offset: 1 },
      { path: [0, 2], offset: 0 },
      { path: [0, 1, 0], offset: 3 },
      { path: [0, 1, 0], offset: 2 },
      { path: [0, 1, 0], offset: 1 },
      { path: [0, 1, 0], offset: 0 },
      { path: [0, 0], offset: 3 },
      { path: [0, 0], offset: 2 },
      { path: [0, 0], offset: 1 },
      { path: [0, 0], offset: 0 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('positions-voids-true-inline-all', () => {
    const input = (
      <editor>
        <block void>
          one<inline>two</inline>three
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.positions(editor, { at: [], voids: true }))
    }
    const output = [
      { path: [0, 0], offset: 0 },
      { path: [0, 0], offset: 1 },
      { path: [0, 0], offset: 2 },
      { path: [0, 0], offset: 3 },
      { path: [0, 1, 0], offset: 0 },
      { path: [0, 1, 0], offset: 1 },
      { path: [0, 1, 0], offset: 2 },
      { path: [0, 1, 0], offset: 3 },
      { path: [0, 2], offset: 0 },
      { path: [0, 2], offset: 1 },
      { path: [0, 2], offset: 2 },
      { path: [0, 2], offset: 3 },
      { path: [0, 2], offset: 4 },
      { path: [0, 2], offset: 5 },
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })
})
