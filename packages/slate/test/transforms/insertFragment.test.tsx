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

describe.concurrent('insertFragment', () => {
  test('insertFragment-of-blocks-block-empty', () => {
    const run = editor => {
      Transforms.insertFragment(
        editor,
        <fragment>
          <block>
            <block>one</block>
          </block>
          <block>two</block>
          <block>three</block>
        </fragment>
      )
    }
    const input = (
      <editor>
        <block>word</block>
        <block>
          <cursor />
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>word</block>
        <block>
          <block>one</block>
        </block>
        <block>two</block>
        <block>
          three
          <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertFragment-of-blocks-block-end', () => {
    const run = editor => {
      Transforms.insertFragment(
        editor,
        <fragment>
          <block>one</block>
          <block>two</block>
          <block>three</block>
        </fragment>
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
        <block>wordone</block>
        <block>two</block>
        <block>
          three
          <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertFragment-of-blocks-block-hanging', () => {
    const fragment = (
      <fragment>
        <block>one</block>
        <block>two</block>
      </fragment>
    )
    const run = editor => {
      Transforms.insertFragment(editor, fragment)
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
        <block>one</block>
        <block>
          two
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

  test('insertFragment-of-blocks-block-middle', () => {
    const run = editor => {
      Transforms.insertFragment(
        editor,
        <fragment>
          <block>one</block>
          <block>two</block>
          <block>three</block>
        </fragment>
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
        <block>woone</block>
        <block>two</block>
        <block>
          three
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

  test('insertFragment-of-blocks-block-nested', () => {
    const run = editor => {
      Transforms.insertFragment(
        editor,
        <fragment>
          <block>one</block>
          <block>two</block>
          <block>three</block>
        </fragment>
      )
    }
    const input = (
      <editor>
        <block>
          <block>
            word
            <cursor />
          </block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <block>wordone</block>
          <block>two</block>
          <block>
            three
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

  test('insertFragment-of-blocks-block-start', () => {
    const run = editor => {
      Transforms.insertFragment(
        editor,
        <fragment>
          <block>one</block>
          <block>two</block>
          <block>three</block>
        </fragment>
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
        <block>one</block>
        <block>two</block>
        <block>
          three
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

  test('insertFragment-of-blocks-with-inline', () => {
    const run = editor => {
      Transforms.insertFragment(
        editor,
        <fragment>
          <block>
            one<inline>two</inline>three
          </block>
          <block>
            four<inline>five</inline>six
          </block>
          <block>
            seven<inline>eight</inline>nine
          </block>
        </fragment>
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
          woone<inline>two</inline>three
        </block>
        <block>
          four<inline>five</inline>six
        </block>
        <block>
          seven<inline>eight</inline>nine
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

  test('insertFragment-of-inlines-block-empty', () => {
    const run = editor => {
      Transforms.insertFragment(
        editor,
        <fragment>
          <inline>fragment</inline>
        </fragment>
      )
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
          <text />
          <inline>
            fragment
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

  test('insertFragment-of-inlines-block-end', () => {
    const run = editor => {
      Transforms.insertFragment(
        editor,
        <fragment>
          <inline>fragment</inline>
        </fragment>
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
    // TODO: this cursor placement seems off
    const output = (
      <editor>
        <block>
          word
          <inline>
            fragment
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

  test('insertFragment-of-inlines-block-middle', () => {
    const run = editor => {
      Transforms.insertFragment(
        editor,
        <fragment>
          <inline>fragment</inline>
        </fragment>
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
          <inline>
            fragment
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

  test('insertFragment-of-inlines-block-start', () => {
    const run = editor => {
      Transforms.insertFragment(
        editor,
        <fragment>
          <inline>fragment</inline>
        </fragment>
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
          <inline>
            fragment
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

  test('insertFragment-of-inlines-inline-empty', () => {
    const run = editor => {
      Transforms.insertFragment(
        editor,
        <fragment>
          <inline>fragment</inline>
        </fragment>
      )
    }
    const input = (
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
    const output = (
      <editor>
        <block>
          <text />
          <inline>
            <text />
          </inline>
          <text />
          <inline>
            fragment
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

  test('insertFragment-of-inlines-inline-middle', () => {
    const run = editor => {
      Transforms.insertFragment(
        editor,
        <fragment>
          <inline>fragment</inline>
        </fragment>
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
          <inline>wo</inline>
          <text />
          <inline>
            fragment
            <cursor />
          </inline>
          <text />
          <inline>rd</inline>
          <text />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertFragment-of-inlines-with-multiple', () => {
    const run = editor => {
      Transforms.insertFragment(
        editor,
        <fragment>
          <inline>one</inline>
          <inline>two</inline>
          <inline>three</inline>
        </fragment>
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
          <inline>wo</inline>
          <text />
          <inline>one</inline>
          <text />
          <inline>two</inline>
          <text />
          <inline>
            three
            <cursor />
          </inline>
          <text />
          <inline>rd</inline>
          <text />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertFragment-of-inlines-with-text', () => {
    const run = editor => {
      Transforms.insertFragment(
        editor,
        <fragment>
          one
          <inline>two</inline>
          three
        </fragment>
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
          woone
          <inline>two</inline>
          three
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

  test.skip('insertFragment-of-lists-merge-lists', () => {
    const run = editor => {
      Transforms.insertFragment(
        editor,
        <block>
          <block>3</block>
          <block>4</block>
        </block>
      )
    }
    const input = (
      <editor>
        <block>
          <block>1</block>
          <block>
            2<cursor />
          </block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <block>1</block>
          <block>23</block>
          <block>
            4<cursor />
          </block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test.skip('insertFragment-of-tables-merge-cells-with-nested-blocks', () => {
    const run = editor => {
      Transforms.insertFragment(
        editor,
        <block>
          <block>
            <block>
              <block>
                <block>1</block>
              </block>
              <block>
                <block>2</block>
              </block>
            </block>
          </block>
        </block>
      )
    }
    const input = (
      <editor>
        <block>
          <block>
            <block>
              <block>
                <block>
                  <cursor />
                </block>
              </block>
              <block>
                <block>
                  <text />
                </block>
              </block>
            </block>
          </block>
        </block>
      </editor>
    )
    // TODO: surely this is the wrong behavior.
    // ideally, paragraph with "2" goes into second cell
    const output = (
      <editor>
        <block>
          <block>
            <block>
              <block>
                <block>1</block>
                <block>
                  <block>
                    2<cursor />
                  </block>
                </block>
              </block>
              <block>
                <block>
                  <text />
                </block>
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

  test.skip('insertFragment-of-tables-merge-into-empty-cells', () => {
    const run = editor => {
      Transforms.insertFragment(
        editor,
        <block>
          <block>
            <block>
              <block>1</block>
              <block>2</block>
            </block>
          </block>
        </block>
      )
    }
    const input = (
      <editor>
        <block>
          <block>
            <block>
              <block>
                <cursor />
              </block>
              <block>
                <text />
              </block>
            </block>
          </block>
        </block>
      </editor>
    )
    // TODO: paste "2" into second cell instead of creating new one?
    const output = (
      <editor>
        <block>
          <block>
            <block>
              <block>1</block>
              <block>
                2<cursor />
              </block>
              <block>
                <text />
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

  test.skip('insertFragment-of-tables-merge-into-full-cells', () => {
    const run = editor => {
      Transforms.insertFragment(
        editor,
        <block>
          <block>
            <block>
              <block>New 1</block>
              <block>New 2</block>
            </block>
          </block>
        </block>
      )
    }
    const input = (
      <editor>
        <block>
          <block>
            <block>
              <block>
                {'Existing 1 '}
                <cursor />
              </block>
              <block>Existing 2</block>
            </block>
          </block>
        </block>
      </editor>
    )
    // TODO: paste "Existing 2" before / after "New 2" in second cell?
    const output = (
      <editor>
        <block>
          <block>
            <block>
              <block>Existing 1 New 1</block>
              <block>
                New 2<cursor />
              </block>
              <block>Existing 2</block>
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

  test('insertFragment-of-texts-block-across', () => {
    const run = editor => {
      Transforms.insertFragment(editor, <fragment>fragment</fragment>)
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
          wofragment
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

  test('insertFragment-of-texts-block-empty', () => {
    const run = editor => {
      Transforms.insertFragment(editor, <fragment>fragment</fragment>)
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
          fragment
          <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertFragment-of-texts-block-end', () => {
    const run = editor => {
      Transforms.insertFragment(editor, <fragment>fragment</fragment>)
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
          wordfragment
          <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertFragment-of-texts-block-middle', () => {
    const run = editor => {
      Transforms.insertFragment(editor, <fragment>fragment</fragment>)
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
          wofragment
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

  test('insertFragment-of-texts-block-start', () => {
    const run = editor => {
      Transforms.insertFragment(editor, <fragment>fragment</fragment>)
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
          fragment
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

  test('insertFragment-of-texts-inline-empty', () => {
    const run = editor => {
      Transforms.insertFragment(editor, <fragment>fragment</fragment>)
    }
    const input = (
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
    // TODO: argument to made that fragment should go into the inline
    const output = (
      <editor>
        <block>
          <text />
          <inline>
            <text />
          </inline>
          fragment
          <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertFragment-of-texts-inline-middle', () => {
    const run = editor => {
      Transforms.insertFragment(editor, <fragment>fragment</fragment>)
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
    // TODO: argument to made that fragment should go into the inline
    const output = (
      <editor>
        <block>
          <text />
          <inline>wo</inline>
          fragment
          <cursor />
          <inline>rd</inline>
          <text />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertFragment-of-texts-with-multiple', () => {
    const run = editor => {
      Transforms.insertFragment(
        editor,
        <fragment>
          <text>one</text>
          <text>two</text>
        </fragment>
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
          woonetwo
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

  test('insertFragment-voids-false-block', () => {
    const run = editor => {
      Transforms.insertFragment(editor, <fragment>fragment</fragment>)
    }
    const input = (
      <editor>
        <block void>
          wo
          <cursor />
          rd
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block void>
          wo
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

  test('insertFragment-voids-false-inline', () => {
    const run = editor => {
      Transforms.insertFragment(editor, <fragment>fragment</fragment>)
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
    // TODO: argument to made that fragment should go into the inline
    const output = (
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

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('insertFragment-voids-true-block', () => {
    const run = editor => {
      Transforms.insertFragment(editor, <fragment>fragment</fragment>, {
        voids: true,
      })
    }
    const input = (
      <editor>
        <block void>
          wo
          <cursor />
          rd
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block void>
          wofragment
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

  test('insertFragment-voids-true-inline', () => {
    const run = editor => {
      Transforms.insertFragment(editor, <fragment>fragment</fragment>, {
        voids: true,
      })
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
    // TODO: argument to made that fragment should go into the inline
    const output = (
      <editor>
        <block>
          <text />
          <inline void>wo</inline>
          fragment
          <cursor />
          <inline void>rd</inline>
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
