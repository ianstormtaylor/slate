/** @jsx jsx  */
import { test, expect, describe } from 'vitest'
import { Node } from 'slate'
import { jsx } from '../jsx'
import { cloneDeep } from 'lodash'
import { withTest } from '../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('Node', () => {
  test('ancestor-success', () => {
    const input = (
      <editor>
        <element>
          <text />
        </element>
      </editor>
    )
    const test = value => {
      return Node.ancestor(value, [0])
    }
    const output = cloneDeep(input.children[0])

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('ancestors-reverse', () => {
    const input = (
      <editor>
        <element>
          <text />
        </element>
      </editor>
    )
    const test = value => {
      return Array.from(Node.ancestors(value, [0, 0], { reverse: true }))
    }
    const output = [
      [input.children[0], [0]],
      [input, []],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('ancestors-success', () => {
    const input = (
      <editor>
        <element>
          <text />
        </element>
      </editor>
    )
    const test = value => {
      return Array.from(Node.ancestors(value, [0, 0]))
    }
    const output = [
      [input, []],
      [input.children[0], [0]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('child-success', () => {
    const input = (
      <editor>
        <element>
          <text />
        </element>
      </editor>
    )
    const test = value => {
      return Node.child(value, 0)
    }
    const output = cloneDeep(input.children[0])

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('children-all', () => {
    const input = (
      <editor>
        <element>
          <text key="a" />
          <text key="b" />
        </element>
      </editor>
    )
    const test = value => {
      return Array.from(Node.children(value, [0]))
    }
    const output = [
      [<text key="a" />, [0, 0]],
      [<text key="b" />, [0, 1]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('children-reverse', () => {
    const input = (
      <editor>
        <element>
          <text key="a" />
          <text key="b" />
        </element>
      </editor>
    )
    const test = value => {
      return Array.from(Node.children(value, [0], { reverse: true }))
    }
    const output = [
      [<text key="b" />, [0, 1]],
      [<text key="a" />, [0, 0]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('descendant-success', () => {
    const input = (
      <editor>
        <element>
          <text />
        </element>
      </editor>
    )
    const test = value => {
      return Node.descendant(value, [0])
    }
    const output = cloneDeep(input.children[0])

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('descendants-all', () => {
    const input = (
      <editor>
        <element>
          <text key="a" />
          <text key="b" />
        </element>
      </editor>
    )
    const test = value => {
      return Array.from(Node.descendants(value))
    }
    const output = [
      [
        <element>
          <text key="a" />
          <text key="b" />
        </element>,
        [0],
      ],
      [<text key="a" />, [0, 0]],
      [<text key="b" />, [0, 1]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('descendants-from', () => {
    const input = (
      <editor>
        <element>
          <text key="a" />
          <text key="b" />
        </element>
      </editor>
    )
    const test = value => {
      return Array.from(Node.descendants(value, { from: [0, 1] }))
    }
    const output = [
      [
        <element>
          <text key="a" />
          <text key="b" />
        </element>,
        [0],
      ],
      [<text key="b" />, [0, 1]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('descendants-reverse', () => {
    const input = (
      <editor>
        <element>
          <text key="a" />
          <text key="b" />
        </element>
      </editor>
    )
    const test = value => {
      return Array.from(Node.descendants(value, { reverse: true }))
    }
    const output = [
      [
        <element>
          <text key="a" />
          <text key="b" />
        </element>,
        [0],
      ],
      [<text key="b" />, [0, 1]],
      [<text key="a" />, [0, 0]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('descendants-to', () => {
    const input = (
      <editor>
        <element>
          <text key="a" />
          <text key="b" />
          <text key="c" />
          <text key="d" />
        </element>
      </editor>
    )
    const test = value => {
      return Array.from(
        Node.descendants(value, {
          from: [0, 1],
          to: [0, 2],
        })
      )
    }
    const output = [
      [
        <element>
          <text key="a" />
          <text key="b" />
          <text key="c" />
          <text key="d" />
        </element>,
        [0],
      ],
      [<text key="b" />, [0, 1]],
      [<text key="c" />, [0, 2]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('elements-all', () => {
    const input = (
      <editor>
        <element>
          <text key="a" />
          <text key="b" />
        </element>
      </editor>
    )
    const test = value => {
      return Array.from(Node.elements(value))
    }
    const output = [
      [
        <element>
          <text key="a" />
          <text key="b" />
        </element>,
        [0],
      ],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('elements-path', () => {
    const input = (
      <editor>
        <element>
          <text key="a" />
          <text key="b" />
        </element>
      </editor>
    )
    const test = value => {
      return Array.from(Node.elements(value, { path: [0, 1] }))
    }
    const output = [
      [
        <element>
          <text key="a" />
          <text key="b" />
        </element>,
        [0],
      ],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('elements-range', () => {
    const input = (
      <editor>
        <element>
          <text key="a" />
          <text key="b" />
          <text key="c" />
          <text key="d" />
        </element>
      </editor>
    )
    const test = value => {
      return Array.from(
        Node.elements(value, {
          range: {
            anchor: {
              path: [0, 1],
              offset: 0,
            },
            focus: {
              path: [0, 2],
              offset: 0,
            },
          },
        })
      )
    }
    const output = [
      [
        <element>
          <text key="a" />
          <text key="b" />
          <text key="c" />
          <text key="d" />
        </element>,
        [0],
      ],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('elements-reverse', () => {
    const input = (
      <editor>
        <element>
          <text key="a" />
          <text key="b" />
        </element>
      </editor>
    )
    const test = value => {
      return Array.from(Node.elements(value, { reverse: true }))
    }
    const output = [
      [
        <element>
          <text key="a" />
          <text key="b" />
        </element>,
        [0],
      ],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('first-success', () => {
    const input = (
      <editor>
        <element>
          <text key="a" />
          <text key="b" />
        </element>
      </editor>
    )
    const test = value => {
      return Node.first(value, [0])
    }
    const output = [<text key="a" />, [0, 0]]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  // TODO: see https://github.com/ianstormtaylor/slate/pull/4188
  test.skip('get-root', () => {
    const input = (
      <editor>
        <element>
          <text />
        </element>
      </editor>
    )
    const test = value => {
      return Node.get(value, [])
    }
    const output = cloneDeep(input)

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('get-success', () => {
    const input = (
      <editor>
        <element>
          <text />
        </element>
      </editor>
    )
    const test = value => {
      return Node.get(value, [0])
    }
    const output = (
      <element>
        <text />
      </element>
    )

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('isNode-boolean', () => {
    const input = true
    const test = value => {
      return Node.isNode(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isNode-custom-property', () => {
    const input = {
      children: [],
      custom: true,
    }
    const test = value => {
      return Node.isNode(value)
    }
    const output = true

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('isNode-element', () => {
    const input = {
      children: [],
    }
    const test = value => {
      return Node.isNode(value)
    }
    const output = true

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('isNode-object', () => {
    const input = {}
    const test = value => {
      return Node.isNode(value)
    }
    const output = false

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('isNode-text', () => {
    const input = {
      text: '',
    }
    const test = value => {
      return Node.isNode(value)
    }
    const output = true

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('isNode-value', () => {
    const input = {
      children: [],
      selection: null,
    }
    const test = value => {
      return Node.isNode(value)
    }
    const output = true

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('isNodeList-boolean', () => {
    const input = true
    const test = value => {
      return Node.isNodeList(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isNodeList-element', () => {
    const input = {
      children: [],
    }
    const test = value => {
      return Node.isNodeList(value)
    }
    const output = false

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('isNodeList-empty', () => {
    const input = []
    const test = value => {
      return Node.isNodeList(value)
    }
    const output = true

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('isNodeList-full-element', () => {
    const input = [
      {
        children: [],
      },
    ]
    const test = value => {
      return Node.isNodeList(value)
    }
    const output = true

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('isNodeList-full-text', () => {
    const input = [
      {
        text: '',
      },
    ]
    const test = value => {
      return Node.isNodeList(value)
    }
    const output = true

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('isNodeList-full-value', () => {
    const input = [
      {
        children: [],
        selection: null,
      },
    ]
    const test = value => {
      return Node.isNodeList(value)
    }
    const output = true

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('isNodeList-not-full-node', () => {
    const input = [
      {
        children: [],
        selection: null,
      },
      'a string',
    ]
    const test = value => {
      return Node.isNodeList(value)
    }
    const output = false

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('leaf-success', () => {
    const input = (
      <editor>
        <element>
          <text />
        </element>
      </editor>
    )
    const test = value => {
      return Node.leaf(value, [0, 0])
    }
    const output = <text />

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('levels-reverse', () => {
    const input = (
      <editor>
        <element>
          <text />
        </element>
      </editor>
    )
    const test = value => {
      return Array.from(Node.levels(value, [0, 0], { reverse: true }))
    }
    const output = [
      [input.children[0].children[0], [0, 0]],
      [input.children[0], [0]],
      [input, []],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('levels-success', () => {
    const input = (
      <editor>
        <element>
          <text />
        </element>
      </editor>
    )
    const test = value => {
      return Array.from(Node.levels(value, [0, 0]))
    }
    const output = [
      [input, []],
      [input.children[0], [0]],
      [input.children[0].children[0], [0, 0]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-all', () => {
    const input = (
      <editor>
        <element>
          <text key="a" />
          <text key="b" />
        </element>
      </editor>
    )
    const test = value => {
      return Array.from(Node.nodes(value))
    }
    const output = [
      [input, []],
      [
        <element>
          <text key="a" />
          <text key="b" />
        </element>,
        [0],
      ],
      [<text key="a" />, [0, 0]],
      [<text key="b" />, [0, 1]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-multiple-elements', () => {
    const input = (
      <editor>
        <element>
          <text key="a" />
        </element>
        <element>
          <text key="b" />
        </element>
      </editor>
    )
    const test = value => {
      return Array.from(Node.nodes(value))
    }
    const output = [
      [input, []],
      [
        <element>
          <text key="a" />
        </element>,
        [0],
      ],
      [<text key="a" />, [0, 0]],
      [
        <element>
          <text key="b" />
        </element>,
        [1],
      ],
      [<text key="b" />, [1, 0]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-nested-elements', () => {
    const input = (
      <editor>
        <element>
          <element>
            <text key="a" />
          </element>
        </element>
      </editor>
    )
    const test = value => {
      return Array.from(Node.nodes(value))
    }
    const output = [
      [input, []],
      [
        <element>
          <element>
            <text key="a" />
          </element>
        </element>,
        [0],
      ],
      [
        <element>
          <text key="a" />
        </element>,
        [0, 0],
      ],
      [<text key="a" />, [0, 0, 0]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-pass', () => {
    const input = (
      <editor>
        <element>
          <element>
            <text key="a" />
          </element>
        </element>
      </editor>
    )
    const test = value => {
      return Array.from(Node.nodes(value, { pass: ([n, p]) => p.length > 1 }))
    }
    const output = [
      [input, []],
      [
        <element>
          <element>
            <text key="a" />
          </element>
        </element>,
        [0],
      ],
      [
        <element>
          <text key="a" />
        </element>,
        [0, 0],
      ],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('nodes-to', () => {
    const input = (
      <editor>
        <element>
          <text key="a" />
          <text key="b" />
          <text key="c" />
          <text key="d" />
        </element>
      </editor>
    )
    const test = value => {
      return Array.from(
        Node.nodes(value, {
          from: [0, 1],
          to: [0, 2],
        })
      )
    }
    const output = [
      [input, []],
      [
        <element>
          <text key="a" />
          <text key="b" />
          <text key="c" />
          <text key="d" />
        </element>,
        [0],
      ],
      [<text key="b" />, [0, 1]],
      [<text key="c" />, [0, 2]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('parent-success', () => {
    const input = (
      <editor>
        <element>
          <text />
        </element>
      </editor>
    )
    const test = value => {
      return Node.parent(value, [0, 0])
    }
    const output = (
      <element>
        <text />
      </element>
    )

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('string-across-elements', () => {
    const input = (
      <editor>
        <element>
          <text>one</text>
          <text>two</text>
        </element>
        <element>
          <text>three</text>
          <text>four</text>
        </element>
      </editor>
    )
    const test = value => {
      return Node.string(value)
    }
    const output = `onetwothreefour`

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('string-element', () => {
    const input = (
      <element>
        <text>one</text>
        <text>two</text>
      </element>
    )
    const test = value => {
      return Node.string(value, [1])
    }
    const output = `onetwo`

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('string-text', () => {
    const input = <text>one</text>
    const test = value => {
      return Node.string(value)
    }
    const output = `one`

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('texts-all', () => {
    const input = (
      <editor>
        <element>
          <text key="a" />
          <text key="b" />
        </element>
      </editor>
    )
    const test = value => {
      return Array.from(Node.texts(value))
    }
    const output = [
      [<text key="a" />, [0, 0]],
      [<text key="b" />, [0, 1]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('texts-from', () => {
    const input = (
      <editor>
        <element>
          <text key="a" />
          <text key="b" />
        </element>
      </editor>
    )
    const test = value => {
      return Array.from(Node.texts(value, { from: [0, 1] }))
    }
    const output = [[<text key="b" />, [0, 1]]]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('texts-multiple-elements', () => {
    const input = (
      <editor>
        <element>
          <text key="a" />
        </element>
        <element>
          <text key="b" />
        </element>
      </editor>
    )
    const test = value => {
      return Array.from(Node.texts(value))
    }
    const output = [
      [<text key="a" />, [0, 0]],
      [<text key="b" />, [1, 0]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('texts-reverse', () => {
    const input = (
      <editor>
        <element>
          <text key="a" />
          <text key="b" />
        </element>
      </editor>
    )
    const test = value => {
      return Array.from(Node.texts(value, { reverse: true }))
    }
    const output = [
      [<text key="b" />, [0, 1]],
      [<text key="a" />, [0, 0]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })

  test('texts-to', () => {
    const input = (
      <editor>
        <element>
          <text key="a" />
          <text key="b" />
          <text key="c" />
          <text key="d" />
        </element>
      </editor>
    )
    const test = value => {
      return Array.from(
        Node.texts(value, {
          from: [0, 1],
          to: [0, 2],
        })
      )
    }
    const output = [
      [<text key="b" />, [0, 1]],
      [<text key="c" />, [0, 2]],
    ]

    const result = test(withTest(input))
    expect(result).toEqual(output)
  })
})
