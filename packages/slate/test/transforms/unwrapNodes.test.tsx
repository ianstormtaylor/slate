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

describe.concurrent('unwrapNodes', () => {
  test('unwrapNodes-match-block-block-across', () => {
    const run = editor => {
      Transforms.unwrapNodes(editor, { match: n => n.a })
    }
    const input = (
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
    const output = (
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

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('unwrapNodes-match-block-block-end', () => {
    const run = editor => {
      Transforms.unwrapNodes(editor, { match: n => n.a })
    }
    const input = (
      <editor>
        <block a>
          <block>one</block>
          <block>two</block>
          <block>three</block>
          <block>four</block>
          <block>
            <anchor />
            five
          </block>
          <block>
            <focus />
            six
          </block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>one</block>
        <block>two</block>
        <block>three</block>
        <block>four</block>
        <block>
          <anchor />
          five
        </block>
        <block>
          <focus />
          six
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('unwrapNodes-match-block-block-inline', () => {
    const run = editor => {
      Transforms.unwrapNodes(editor, { match: n => n.a })
    }
    const input = (
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
    const output = (
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

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('unwrapNodes-match-block-block-middle', () => {
    const run = editor => {
      Transforms.unwrapNodes(editor, { match: n => n.a })
    }
    const input = (
      <editor>
        <block a>
          <block>one</block>
          <block>two</block>
          <block>
            <anchor />
            three
          </block>
          <block>
            <focus />
            four
          </block>
          <block>five</block>
          <block>six</block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>one</block>
        <block>two</block>
        <block>
          <anchor />
          three
        </block>
        <block>
          <focus />
          four
        </block>
        <block>five</block>
        <block>six</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('unwrapNodes-match-block-block-nested', () => {
    const run = editor => {
      Transforms.unwrapNodes(editor, { match: n => n.a })
    }
    const input = (
      <editor>
        <block a>
          <block>
            <block>
              <cursor />
              word
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

  test('unwrapNodes-match-block-block-start', () => {
    const run = editor => {
      Transforms.unwrapNodes(editor, { match: n => n.a })
    }
    const input = (
      <editor>
        <block a>
          <block>
            <anchor />
            one
          </block>
          <block>
            <focus />
            two
          </block>
          <block>three</block>
          <block>four</block>
          <block>five</block>
          <block>six</block>
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
          <focus />
          two
        </block>
        <block>three</block>
        <block>four</block>
        <block>five</block>
        <block>six</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('unwrapNodes-match-block-block', () => {
    const run = editor => {
      Transforms.unwrapNodes(editor, { match: n => n.a })
    }
    const input = (
      <editor>
        <block a>
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

  test('unwrapNodes-match-inline-block-nested', () => {
    const run = editor => {
      Transforms.unwrapNodes(editor, { match: n => n.a })
    }
    const input = (
      <editor>
        <block>
          <block>
            w<anchor />
            <inline a>
              or
              <focus />
            </inline>
            d
          </block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <block>
            w<anchor />
            or
            <focus />d
          </block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('unwrapNodes-match-inline-inline-across', () => {
    const run = editor => {
      Transforms.unwrapNodes(editor, { match: n => n.a })
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline a>
            <anchor />
            one
          </inline>
          two
          <inline a>
            three
            <focus />
          </inline>
          <text />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <anchor />
          onetwothree
          <focus />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('unwrapNodes-match-inline-inline-over', () => {
    const run = editor => {
      Transforms.unwrapNodes(editor, { match: n => n.a })
    }
    const input = (
      <editor>
        <block>
          w<anchor />o<inline a>rd</inline>
          <text />
        </block>
        <block>
          <text />
          <inline a>an</inline>
          ot
          <focus />
          her
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          w<anchor />
          ord
        </block>
        <block>
          anot
          <focus />
          her
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('unwrapNodes-match-inline-inline', () => {
    const run = editor => {
      Transforms.unwrapNodes(editor, { match: n => n.a })
    }
    const input = (
      <editor>
        <block>
          w<anchor />
          <inline a>
            or
            <focus />
          </inline>
          d
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          w<anchor />
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

  test('unwrapNodes-mode-all-match-ancestors', () => {
    const run = editor => {
      Transforms.unwrapNodes(editor, { match: n => n.a, mode: 'all' })
    }
    const input = (
      <editor>
        <block a>
          <block a>
            <block>
              <cursor />
              word
            </block>
          </block>
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

  test('unwrapNodes-mode-all-match-siblings-and-parent', () => {
    const run = editor => {
      Transforms.unwrapNodes(editor, { match: n => n.a, mode: 'all' })
    }
    const input = (
      <editor>
        <block a>
          <block a>
            <block>
              <anchor />
              one
            </block>
          </block>
          <block a>
            <block>
              two
              <focus />
            </block>
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
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('unwrapNodes-mode-all-match-siblings', () => {
    const run = editor => {
      Transforms.unwrapNodes(editor, { match: n => n.a, mode: 'all' })
    }
    const input = (
      <editor>
        <block a>
          <block>
            <anchor />
            one
          </block>
        </block>
        <block a>
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
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('unwrapNodes-mode-all-match-some-siblings-and-parent-split', () => {
    const run = editor => {
      Transforms.unwrapNodes(editor, {
        match: n => n.a,
        mode: 'all',
        split: true,
      })
    }
    const input = (
      <editor>
        <block a>
          <block a>
            <block>
              <anchor />
              one
            </block>
          </block>
          <block a>
            <block>
              two
              <focus />
            </block>
          </block>
          <block a>
            <block>three</block>
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
        <block a>
          <block a>
            <block>three</block>
          </block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('unwrapNodes-mode-all-match-some-siblings-and-parent', () => {
    const run = editor => {
      Transforms.unwrapNodes(editor, { match: n => n.a, mode: 'all' })
    }
    const input = (
      <editor>
        <block a>
          <block a>
            <block>
              <anchor />
              one
            </block>
          </block>
          <block a>
            <block>
              two
              <focus />
            </block>
          </block>
          <block a>
            <block>three</block>
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
        <block a>
          <block>three</block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('unwrapNodes-mode-all-match-some-siblings', () => {
    const run = editor => {
      Transforms.unwrapNodes(editor, { match: n => n.a, mode: 'all' })
    }
    const input = (
      <editor>
        <block a>
          <block>
            <anchor />
            one
          </block>
        </block>
        <block a>
          <block>
            two
            <focus />
          </block>
        </block>
        <block a>
          <block>three</block>
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
        <block a>
          <block>three</block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('unwrapNodes-path-block-multiple', () => {
    const run = editor => {
      Transforms.unwrapNodes(editor, { at: [0] })
    }
    const input = (
      <editor>
        <block>
          <block>one</block>
          <block>two</block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('unwrapNodes-path-block', () => {
    const run = editor => {
      Transforms.unwrapNodes(editor, { at: [0] })
    }
    const input = (
      <editor>
        <block>
          <block>word</block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>word</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('unwrapNodes-split-block-block-all-nested', () => {
    const run = editor => {
      Transforms.unwrapNodes(editor, {
        match: n => !!n.a,
        mode: 'all',
        split: true,
      })
    }
    const input = (
      <editor>
        <block a>
          <block a>
            <block>one</block>
            <block>
              <cursor />
              word
            </block>
            <block>now</block>
          </block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block a>
          <block a>
            <block>one</block>
          </block>
        </block>
        <block>
          <cursor />
          word
        </block>
        <block a>
          <block a>
            <block>now</block>
          </block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('unwrapNodes-split-block-block-all', () => {
    const run = editor => {
      Transforms.unwrapNodes(editor, { match: n => n.a, split: true })
    }
    const input = (
      <editor>
        <block a>
          <block>
            <anchor />
            one
          </block>
          <block>two</block>
          <block>three</block>
          <block>four</block>
          <block>five</block>
          <block>
            six
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
        <block>two</block>
        <block>three</block>
        <block>four</block>
        <block>five</block>
        <block>
          six
          <focus />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('unwrapNodes-split-block-block-end', () => {
    const run = editor => {
      Transforms.unwrapNodes(editor, { match: n => n.a, split: true })
    }
    const input = (
      <editor>
        <block a>
          <block>one</block>
          <block>two</block>
          <block>three</block>
          <block>four</block>
          <block>
            <anchor />
            five
          </block>
          <block>
            six
            <focus />
          </block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block a>
          <block>one</block>
          <block>two</block>
          <block>three</block>
          <block>four</block>
        </block>
        <block>
          <anchor />
          five
        </block>
        <block>
          six
          <focus />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('unwrapNodes-split-block-block-middle', () => {
    const run = editor => {
      Transforms.unwrapNodes(editor, { match: n => n.a, split: true })
    }
    const input = (
      <editor>
        <block a>
          <block>one</block>
          <block>two</block>
          <block>
            <anchor />
            three
          </block>
          <block>
            four
            <focus />
          </block>
          <block>five</block>
          <block>six</block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block a>
          <block>one</block>
          <block>two</block>
        </block>
        <block>
          <anchor />
          three
        </block>
        <block>
          four
          <focus />
        </block>
        <block a>
          <block>five</block>
          <block>six</block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('unwrapNodes-split-block-block-nested', () => {
    const run = editor => {
      Transforms.unwrapNodes(editor, { match: n => n.a, split: true })
    }
    const input = (
      <editor>
        <block>
          <block a>
            <block>one</block>
            <block>two</block>
            <block>
              <anchor />
              three
            </block>
            <block>
              four
              <focus />
            </block>
            <block>five</block>
            <block>six</block>
          </block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <block a>
            <block>one</block>
            <block>two</block>
          </block>
          <block>
            <anchor />
            three
          </block>
          <block>
            four
            <focus />
          </block>
          <block a>
            <block>five</block>
            <block>six</block>
          </block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('unwrapNodes-split-block-block-start', () => {
    const run = editor => {
      Transforms.unwrapNodes(editor, { match: n => n.a, split: true })
    }
    const input = (
      <editor>
        <block a>
          <block>
            <anchor />
            one
          </block>
          <block>
            two
            <focus />
          </block>
          <block>three</block>
          <block>four</block>
          <block>five</block>
          <block>six</block>
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
        <block a>
          <block>three</block>
          <block>four</block>
          <block>five</block>
          <block>six</block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('unwrapNodes-split-block-block', () => {
    const run = editor => {
      Transforms.unwrapNodes(editor, { match: n => n.a, split: true })
    }
    const input = (
      <editor>
        <block a>
          <block>
            <cursor />
            one
          </block>
        </block>
      </editor>
    )
    const output = (
      <editor>
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
})
