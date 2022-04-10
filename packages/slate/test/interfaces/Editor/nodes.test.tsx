/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { jsx } from '../../jsx'
import { Editor, Text } from 'slate'
import { withTest } from '../../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('nodes', () => {
  test('nodes-match-function-block', () => {
    const input = (
      <editor>
        <block>one</block>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.nodes(editor, {
          at: [],
          match: n => Editor.isBlock(editor, n),
        })
      )
    }
    const output = [[<block>one</block>, [0]]]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-match-function-editor', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
        <block>three</block>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.nodes(editor, {
          at: [],
          match: () => true,
          mode: 'highest',
        })
      )
    }
    const output = [[input, []]]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-match-function-inline', () => {
    const input = (
      <editor>
        <block>
          one<inline>two</inline>three
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.nodes(editor, {
          at: [],
          match: n => Editor.isInline(editor, n),
        })
      )
    }
    const output = [[<inline>two</inline>, [0, 1]]]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-mode-all-block', () => {
    const input = (
      <editor>
        <block a>
          <block a>one</block>
        </block>
        <block a>
          <block a>two</block>
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.nodes(editor, { at: [], match: n => n.a, mode: 'all' })
      )
    }
    const output = [
      [
        <block a>
          <block a>one</block>
        </block>,
        [0],
      ],
      [<block a>one</block>, [0, 0]],
      [
        <block a>
          <block a>two</block>
        </block>,
        [1],
      ],
      [<block a>two</block>, [1, 0]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-mode-highest-block', () => {
    const input = (
      <editor>
        <block a>
          <block a>one</block>
        </block>
        <block a>
          <block a>two</block>
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.nodes(editor, { at: [], match: n => n.a, mode: 'highest' })
      )
    }
    const output = [
      [
        <block a>
          <block a>one</block>
        </block>,
        [0],
      ],
      [
        <block a>
          <block a>two</block>
        </block>,
        [1],
      ],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-mode-lowest-block', () => {
    const input = (
      <editor>
        <block a>
          <block a>one</block>
        </block>
        <block a>
          <block a>two</block>
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.nodes(editor, { at: [], match: n => n.a, mode: 'lowest' })
      )
    }
    const output = [
      [<block a>one</block>, [0, 0]],
      [<block a>two</block>, [1, 0]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-mode-universal-all-nested', () => {
    const input = (
      <editor>
        <block a>
          <block a>one</block>
        </block>
        <block a>
          <block a>two</block>
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.nodes(editor, {
          at: [],
          match: n => n.a === true,
          mode: 'lowest',
          universal: true,
        })
      )
    }
    const output = [
      [<block a>one</block>, [0, 0]],
      [<block a>two</block>, [1, 0]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-mode-universal-all', () => {
    const input = (
      <editor>
        <block a>one</block>
        <block a>two</block>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.nodes(editor, {
          at: [],
          match: n => n.a === true,
          mode: 'lowest',
          universal: true,
        })
      )
    }
    const output = [
      [<block a>one</block>, [0]],
      [<block a>two</block>, [1]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-mode-universal-branch-nested', () => {
    const input = (
      <editor>
        <block a>
          <block b>one</block>
        </block>
        <block b>
          <block a>two</block>
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.nodes(editor, {
          at: [],
          match: n => n.a === true,
          mode: 'lowest',
          universal: true,
        })
      )
    }
    const output = [
      [
        <block a>
          <block b>one</block>
        </block>,
        [0],
      ],
      [<block a>two</block>, [1, 0]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-mode-universal-none-nested', () => {
    const input = (
      <editor>
        <block a>
          <block a>one</block>
        </block>
        <block a>
          <block a>two</block>
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.nodes(editor, {
          at: [],
          match: n => n.b === true,
          mode: 'lowest',
          universal: true,
        })
      )
    }
    const output = []

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-mode-universal-none', () => {
    const input = (
      <editor>
        <block a>one</block>
        <block a>two</block>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.nodes(editor, {
          at: [],
          match: n => n.b === true,
          mode: 'lowest',
          universal: true,
        })
      )
    }
    const output = []

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-mode-universal-some-nested', () => {
    const input = (
      <editor>
        <block a>
          <block a>one</block>
        </block>
        <block b>
          <block b>two</block>
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.nodes(editor, {
          at: [],
          match: n => n.a,
          mode: 'lowest',
          universal: true,
        })
      )
    }
    const output = []

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-mode-universal-some', () => {
    const input = (
      <editor>
        <block a>one</block>
        <block b>two</block>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.nodes(editor, {
          at: [],
          match: n => n.a,
          mode: 'lowest',
          universal: true,
        })
      )
    }
    const output = []

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-no-match-block-multiple', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.nodes(editor, { at: [] }))
    }
    const output = [
      [input, []],
      [<block>one</block>, [0]],
      [<text>one</text>, [0, 0]],
      [<block>two</block>, [1]],
      [<text>two</text>, [1, 0]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-no-match-block-nested', () => {
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
      return Array.from(Editor.nodes(editor, { at: [] }))
    }
    const output = [
      [input, []],
      [
        <block>
          <block>one</block>
        </block>,
        [0],
      ],
      [<block>one</block>, [0, 0]],
      [<text>one</text>, [0, 0, 0]],
      [
        <block>
          <block>two</block>
        </block>,
        [1],
      ],
      [<block>two</block>, [1, 0]],
      [<text>two</text>, [1, 0, 0]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-no-match-block-reverse', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.nodes(editor, { at: [], reverse: true }))
    }
    const output = [
      [input, []],
      [<block>two</block>, [1]],
      [<text>two</text>, [1, 0]],
      [<block>one</block>, [0]],
      [<text>one</text>, [0, 0]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-no-match-block-void', () => {
    const input = (
      <editor>
        <block void>one</block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.nodes(editor, { at: [] }))
    }
    const output = [
      [input, []],
      [<block void>one</block>, [0]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-no-match-block', () => {
    const input = (
      <editor>
        <block>one</block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.nodes(editor, { at: [] }))
    }
    const output = [
      [input, []],
      [<block>one</block>, [0]],
      [<text>one</text>, [0, 0]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-no-match-inline-multiple', () => {
    const input = (
      <editor>
        <block>
          one<inline>two</inline>three<inline>four</inline>five
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.nodes(editor, { at: [] }))
    }
    const output = [
      [input, []],
      [
        <block>
          one<inline>two</inline>three<inline>four</inline>five
        </block>,
        [0],
      ],
      [<text>one</text>, [0, 0]],
      [<inline>two</inline>, [0, 1]],
      [<text>two</text>, [0, 1, 0]],
      [<text>three</text>, [0, 2]],
      [<inline>four</inline>, [0, 3]],
      [<text>four</text>, [0, 3, 0]],
      [<text>five</text>, [0, 4]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-no-match-inline-nested', () => {
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
      return Array.from(Editor.nodes(editor, { at: [] }))
    }
    const output = [
      [input, []],
      [
        <block>
          one
          <inline>
            two<inline>three</inline>four
          </inline>
          five
        </block>,
        [0],
      ],
      [<text>one</text>, [0, 0]],
      [
        <inline>
          two<inline>three</inline>four
        </inline>,
        [0, 1],
      ],
      [<text>two</text>, [0, 1, 0]],
      [<inline>three</inline>, [0, 1, 1]],
      [<text>three</text>, [0, 1, 1, 0]],
      [<text>four</text>, [0, 1, 2]],
      [<text>five</text>, [0, 2]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-no-match-inline-reverse', () => {
    const input = (
      <editor>
        <block>
          one<inline>two</inline>three<inline>four</inline>five
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.nodes(editor, { at: [], reverse: true }))
    }
    const output = [
      [input, []],
      [
        <block>
          one<inline>two</inline>three<inline>four</inline>five
        </block>,
        [0],
      ],
      [<text>five</text>, [0, 4]],
      [<inline>four</inline>, [0, 3]],
      [<text>four</text>, [0, 3, 0]],
      [<text>three</text>, [0, 2]],
      [<inline>two</inline>, [0, 1]],
      [<text>two</text>, [0, 1, 0]],
      [<text>one</text>, [0, 0]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-no-match-inline-void', () => {
    const input = (
      <editor>
        <block>
          one<inline void>two</inline>three
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.nodes(editor, { at: [] }))
    }
    const output = [
      [input, []],
      [
        <block>
          one<inline void>two</inline>three
        </block>,
        [0],
      ],
      [<text>one</text>, [0, 0]],
      [<inline void>two</inline>, [0, 1]],
      [<text>three</text>, [0, 2]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-no-match-inline', () => {
    const input = (
      <editor>
        <block>
          one<inline>two</inline>three
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(Editor.nodes(editor, { at: [] }))
    }
    const output = [
      [input, []],
      [
        <block>
          one<inline>two</inline>three
        </block>,
        [0],
      ],
      [<text>one</text>, [0, 0]],
      [<inline>two</inline>, [0, 1]],
      [<text>two</text>, [0, 1, 0]],
      [<text>three</text>, [0, 2]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-voids-true-block', () => {
    const input = (
      <editor>
        <block void>one</block>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.nodes(editor, { at: [], match: Text.isText, voids: true })
      )
    }
    const output = [[<text>one</text>, [0, 0]]]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-voids-true-inline', () => {
    const input = (
      <editor>
        <block>
          one<inline void>two</inline>three
        </block>
      </editor>
    )
    const test = editor => {
      return Array.from(
        Editor.nodes(editor, { at: [], match: Text.isText, voids: true })
      )
    }
    const output = [
      [<text>one</text>, [0, 0]],
      [<text>two</text>, [0, 1, 0]],
      [<text>three</text>, [0, 2]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })
})
