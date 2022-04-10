/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { jsx } from '../jsx'
import { Node, Text, Transforms } from 'slate'
import { withTest } from '../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('wrapNodes', () => {
  test('wrapNodes-block-block-across-nested', () => {
    const run = editor => {
      Transforms.wrapNodes(editor, <block a />)
    }
    const input = (
      <editor>
        <block>
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
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <block a>
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
          </block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('wrapNodes-block-block-across-uneven', () => {
    const run = editor => {
      Transforms.wrapNodes(editor, <block a />)
    }
    const input = (
      <editor>
        <block>
          <block>
            wo
            <anchor />
            rd
          </block>
          <block>
            <block>
              an
              <focus />
              other
            </block>
          </block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <block a>
            <block>
              wo
              <anchor />
              rd
            </block>
            <block>
              <block>
                an
                <focus />
                other
              </block>
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

  test('wrapNodes-block-block-across', () => {
    const run = editor => {
      Transforms.wrapNodes(editor, <block a />)
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
        <block a>
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
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('wrapNodes-block-block-end', () => {
    const input = (
      <editor>
        <block>one</block>
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
    const run = editor => {
      Transforms.wrapNodes(editor, <block a />)
    }
    const output = (
      <editor>
        <block>one</block>
        <block a>
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

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('wrapNodes-block-block-nested', () => {
    const run = editor => {
      Transforms.wrapNodes(editor, <block new />)
    }
    const input = (
      <editor>
        <block a>
          <block b>
            <cursor />
            word
          </block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block a>
          <block new>
            <block b>
              <cursor />
              word
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

  test('wrapNodes-block-block', () => {
    const run = editor => {
      Transforms.wrapNodes(editor, <block a />)
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
        <block a>
          <block>
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

  test('wrapNodes-block-inline-across', () => {
    const run = editor => {
      Transforms.wrapNodes(editor, <block a />)
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
        <block a>
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
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('wrapNodes-block-omit-all', () => {
    const run = editor => {
      Transforms.wrapNodes(editor, <block a />, {
        match: (node, currentPath) => {
          // reject all nodes inside blocks tagged `noneditable`. Which is everything.
          if (node.noneditable) return false
          for (const [node, _] of Node.ancestors(editor, currentPath)) {
            if (node.noneditable) return false
          }
          return true
        },
      })
    }
    const input = (
      <editor>
        <block noneditable>
          <cursor />
          word
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block noneditable>
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

  test('wrapNodes-block-omit-nodes', () => {
    const run = editor => {
      Transforms.wrapNodes(
        editor,
        <block a>
          <block b>
            <text />
          </block>
        </block>
      )
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
        <block a>
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
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('wrapNodes-inline-inline-across-nested', () => {
    const run = editor => {
      Transforms.wrapNodes(editor, <inline a />)
    }
    const input = (
      <editor>
        <block>
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
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <block>
            <text />
            <inline a>
              <text />
              <inline>
                wo
                <anchor />
                rd
              </inline>
              <text />
            </inline>
            <text />
          </block>
          <block>
            <text />
            <inline a>
              <text />
              <inline>
                an
                <focus />
                other
              </inline>
              <text />
            </inline>
            <text />
          </block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('wrapNodes-inline-inline-across', () => {
    const run = editor => {
      Transforms.wrapNodes(editor, <inline a />)
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
          <inline a>
            <text />
            <inline>
              wo
              <anchor />
              rd
            </inline>
            <text />
          </inline>
          <text />
        </block>
        <block>
          <text />
          <inline a>
            <text />
            <inline>
              an
              <focus />
              other
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

  test('wrapNodes-inline-inline', () => {
    const run = editor => {
      Transforms.wrapNodes(editor, <inline a />)
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
          <inline>
            <text />
            <inline a>
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

  test('wrapNodes-inline-text', () => {
    const run = editor => {
      Transforms.wrapNodes(editor, <inline a />)
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
          <inline a>
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

  test('wrapNodes-path-block', () => {
    const run = editor => {
      Transforms.wrapNodes(editor, <block a />, { at: [0] })
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
        <block a>
          <block>
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

  test('wrapNodes-selection-depth-text', () => {
    const input = (
      <editor>
        <block>
          <text>
            <anchor />
            word
            <focus />
          </text>
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.wrapNodes(editor, <block new />, { match: Text.isText })
    }
    const output = (
      <editor>
        <block>
          <block new>
            <anchor />
            word
            <focus />
          </block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('wrapNodes-split-block-block-across', () => {
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
      Transforms.wrapNodes(editor, <block new />, { split: true })
    }
    const output = (
      <editor>
        <block>on</block>
        <block new>
          <block>
            <anchor />e
          </block>
          <block>
            t<focus />
          </block>
        </block>
        <block>wo</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('wrapNodes-split-block-block-end', () => {
    const input = (
      <editor>
        <block>
          wo
          <anchor />
          rd
          <focus />
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.wrapNodes(editor, <block new />, { split: true })
    }
    const output = (
      <editor>
        <block>wo</block>
        <block new>
          <block>
            <anchor />
            rd
            <focus />
          </block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('wrapNodes-split-block-block-middle', () => {
    const input = (
      <editor>
        <block>
          w<anchor />
          or
          <focus />d
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.wrapNodes(editor, <block new />, { split: true })
    }
    const output = (
      <editor>
        <block>w</block>
        <block new>
          <block>
            <anchor />
            or
            <focus />
          </block>
        </block>
        <block>d</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('wrapNodes-split-block-block-nested', () => {
    const input = (
      <editor>
        <block a>
          <block>
            w<anchor />
            or
            <focus />d
          </block>
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.wrapNodes(editor, <block new />, { split: true })
    }
    const output = (
      <editor>
        <block a>
          <block>w</block>
          <block new>
            <block>
              <anchor />
              or
              <focus />
            </block>
          </block>
          <block>d</block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('wrapNodes-split-block-block-start', () => {
    const input = (
      <editor>
        <block>
          <anchor />
          wo
          <focus />
          rd
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.wrapNodes(editor, <block new />, { split: true })
    }
    const output = (
      <editor>
        <block new>
          <block>
            <anchor />
            wo
            <focus />
          </block>
        </block>
        <block>rd</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('wrapNodes-split-block-block', () => {
    const input = (
      <editor>
        <block>
          <cursor />
          word
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.wrapNodes(editor, <block new />, { split: true })
    }
    const output = (
      <editor>
        <block new>
          <block>
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

  test('wrapNodes-split-inline-inline', () => {
    const input = (
      <editor>
        <block>
          one
          <anchor />
          two
          <focus />
          three
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.wrapNodes(editor, <inline new />, { split: true })
    }
    const output = (
      <editor>
        <block>
          one
          <inline new>
            <anchor />
            two
            <focus />
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

  test('wrapNodes-voids-true-block', () => {
    const run = editor => {
      Transforms.wrapNodes(editor, <block a />, { at: [0, 0], voids: true })
    }
    const input = (
      <editor>
        <block void>word</block>
      </editor>
    )
    const output = (
      <editor>
        <block void>
          <block a>word</block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })
})
