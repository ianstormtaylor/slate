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

describe.concurrent('move', () => {
  test('move-anchor-backward', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'anchor' })
    }
    const input = (
      <editor>
        <block>
          one <anchor />
          two th
          <focus />
          ree
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one t<anchor />
          wo th
          <focus />
          ree
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-anchor-basic', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'anchor' })
    }
    const input = (
      <editor>
        <block>
          one <anchor />
          tw
          <focus />o three
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one t<anchor />w<focus />o three
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-anchor-collapsed', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'anchor' })
    }
    const input = (
      <editor>
        <block>
          one two t<cursor />
          hree
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one two t<focus />h<anchor />
          ree
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-anchor-distance', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'anchor', distance: 3 })
    }
    const input = (
      <editor>
        <block>
          one <anchor />
          two thr
          <focus />
          ee
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one two
          <anchor /> thr
          <focus />
          ee
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-anchor-reverse-backward', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'anchor', reverse: true })
    }
    const input = (
      <editor>
        <block>
          one <focus />
          two th
          <anchor />
          ree
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one <focus />
          two t<anchor />
          hree
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-anchor-reverse-basic', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'anchor', reverse: true })
    }
    const input = (
      <editor>
        <block>
          one <anchor />
          tw
          <focus />o three
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one
          <anchor /> tw
          <focus />o three
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-anchor-reverse-distance', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'anchor', reverse: true, distance: 3 })
    }
    const input = (
      <editor>
        <block>
          one <anchor />
          tw
          <focus />o three
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          o<anchor />
          ne tw
          <focus />o three
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-both-backward-reverse', () => {
    const run = editor => {
      Transforms.move(editor, { reverse: true })
    }
    const input = (
      <editor>
        <block>
          one <focus />
          two th
          <anchor />
          ree
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one
          <focus /> two t<anchor />
          hree
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-both-backward', () => {
    const run = editor => {
      Transforms.move(editor)
    }
    const input = (
      <editor>
        <block>
          one <focus />
          two th
          <anchor />
          ree
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one t<focus />
          wo thr
          <anchor />
          ee
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-both-basic-reverse', () => {
    const run = editor => {
      Transforms.move(editor, { reverse: true })
    }
    const input = (
      <editor>
        <block>
          one <cursor />
          two three
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one
          <cursor /> two three
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-both-collapsed', () => {
    const run = editor => {
      Transforms.move(editor)
    }
    const input = (
      <editor>
        <block>
          one <cursor />
          two three
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one t<cursor />
          wo three
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-both-distance-reverse', () => {
    const run = editor => {
      Transforms.move(editor, { reverse: true, distance: 6 })
    }
    const input = (
      <editor>
        <block>
          one two th
          <cursor />
          ree
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one <cursor />
          two three
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-both-distance', () => {
    const run = editor => {
      Transforms.move(editor, { distance: 6 })
    }
    const input = (
      <editor>
        <block>
          one <cursor />
          two three
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one two th
          <cursor />
          ree
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-both-expanded-reverse', () => {
    const run = editor => {
      Transforms.move(editor, { reverse: true })
    }
    const input = (
      <editor>
        <block>
          one <anchor />
          two th
          <focus />
          ree
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one
          <anchor /> two t<focus />
          hree
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-both-expanded', () => {
    const run = editor => {
      Transforms.move(editor)
    }
    const input = (
      <editor>
        <block>
          one <anchor />
          two th
          <focus />
          ree
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one t<anchor />
          wo thr
          <focus />
          ee
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-both-unit-word-reverse', () => {
    const run = editor => {
      Transforms.move(editor, { reverse: true, unit: 'word' })
    }
    const input = (
      <editor>
        <block>
          one tw
          <cursor />o three
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one <cursor />
          two three
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-both-unit-word', () => {
    const run = editor => {
      Transforms.move(editor, { unit: 'word' })
    }
    const input = (
      <editor>
        <block>
          one <cursor />
          two three
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one two
          <cursor /> three
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-emojis-keycap-reverse', () => {
    const run = editor => {
      Transforms.move(editor, { reverse: true })
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            word5️⃣
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
            5️⃣
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

  test('move-emojis-keycap', () => {
    const run = editor => {
      Transforms.move(editor)
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            word
            <cursor />
            5️⃣
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
            word5️⃣
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

  test('move-emojis-ri-reverse', () => {
    const run = editor => {
      Transforms.move(editor, { reverse: true })
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
            🇫🇷
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

  test('move-emojis-ri', () => {
    const run = editor => {
      Transforms.move(editor)
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            word
            <cursor />
            🇫🇷
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
            word🇫🇷
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

  test('move-emojis-tag-reverse', () => {
    const run = editor => {
      Transforms.move(editor, { reverse: true })
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            word🏴󠁧󠁢󠁳󠁣󠁴󠁿
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
            🏴󠁧󠁢󠁳󠁣󠁴󠁿
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

  test('move-emojis-tag', () => {
    const run = editor => {
      Transforms.move(editor)
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            word
            <cursor />
            🏴󠁧󠁢󠁳󠁣󠁴󠁿
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
            word🏴󠁧󠁢󠁳󠁣󠁴󠁿
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

  test('move-emojis-zwj-reverse', () => {
    const run = editor => {
      Transforms.move(editor, { reverse: true })
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            word👨‍👩‍👧‍👧
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
            👨‍👩‍👧‍👧
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

  test('move-emojis-zwj', () => {
    const run = editor => {
      Transforms.move(editor)
    }
    const input = (
      <editor>
        <block>
          <text />
          <inline>
            word
            <cursor />
            👨‍👩‍👧‍👧
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
            word👨‍👩‍👧‍👧
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

  test('move-end-backward-reverse', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'end', reverse: true })
    }
    const input = (
      <editor>
        <block>
          one <focus />
          two t<anchor />
          hree
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one <focus />
          two <anchor />
          three
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-end-backward', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'end' })
    }
    const input = (
      <editor>
        <block>
          one <focus />
          two t<anchor />
          hree
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one <focus />
          two th
          <anchor />
          ree
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-end-collapsed-reverse', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'end', reverse: true })
    }
    const input = (
      <editor>
        <block>
          one two t<cursor />
          hree
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one two <focus />t<anchor />
          hree
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-end-distance-reverse', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'end', reverse: true, distance: 3 })
    }
    const input = (
      <editor>
        <block>
          one <anchor />
          two t<focus />
          hree
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one <anchor />
          tw
          <focus />o three
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-end-distance', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'end', distance: 3 })
    }
    const input = (
      <editor>
        <block>
          one <anchor />
          two t<focus />
          hree
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one <anchor />
          two thre
          <focus />e
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-end-expanded-reverse', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'end', reverse: true })
    }
    const input = (
      <editor>
        <block>
          one <anchor />
          two t<focus />
          hree
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one <anchor />
          two <focus />
          three
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-end-expanded', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'end' })
    }
    const input = (
      <editor>
        <block>
          one <anchor />
          two t<focus />
          hree
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one <anchor />
          two th
          <focus />
          ree
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-end-from-backward-reverse', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'end', reverse: true, distance: 7 })
    }
    const input = (
      <editor>
        <block>
          one <focus />
          two <anchor />
          three
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          o<anchor />
          ne <focus />
          two three
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-end-to-backward-reverse', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'end', reverse: true, distance: 6 })
    }
    const input = (
      <editor>
        <block>
          one <anchor />
          two
          <focus /> three
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          o<focus />
          ne <anchor />
          two three
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-focus-backward', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'focus', distance: 7 })
    }
    const input = (
      <editor>
        <block>
          one <focus />
          two <anchor />
          three
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one two <anchor />
          thr
          <focus />
          ee
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-focus-collapsed-reverse', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'focus', reverse: true })
    }
    const input = (
      <editor>
        <block>
          one two t<cursor />
          hree
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one two <focus />t<anchor />
          hree
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-focus-distance-reverse', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'focus', reverse: true, distance: 6 })
    }
    const input = (
      <editor>
        <block>
          one <anchor />
          two thr
          <focus />
          ee
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one <anchor />t<focus />
          wo three
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-focus-distance', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'focus', distance: 4 })
    }
    const input = (
      <editor>
        <block>
          one <anchor />
          tw
          <focus />o three
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one <anchor />
          two th
          <focus />
          ree
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-focus-expanded-reverse', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'focus', reverse: true })
    }
    const input = (
      <editor>
        <block>
          one <anchor />
          tw
          <focus />o three
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one <anchor />t<focus />
          wo three
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-focus-expanded', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'focus' })
    }
    const input = (
      <editor>
        <block>
          one <anchor />
          tw
          <focus />o three
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one <anchor />
          two
          <focus /> three
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-focus-to-backward-reverse', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'focus', reverse: true, distance: 10 })
    }
    const input = (
      <editor>
        <block>
          one <anchor />
          two thr
          <focus />
          ee
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          o<focus />
          ne <anchor />
          two three
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-start-backward-reverse', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'start', reverse: true })
    }
    const input = (
      <editor>
        <block>
          one <focus />
          two t<anchor />
          hree
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one
          <focus /> two t<anchor />
          hree
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-start-backward', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'start' })
    }
    const input = (
      <editor>
        <block>
          one <focus />
          two t<anchor />
          hree
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one t<focus />
          wo t<anchor />
          hree
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-start-distance-reverse', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'start', reverse: true, distance: 3 })
    }
    const input = (
      <editor>
        <block>
          one <anchor />
          two t<focus />
          hree
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          o<anchor />
          ne two t<focus />
          hree
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-start-distance', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'start', distance: 3 })
    }
    const input = (
      <editor>
        <block>
          one <anchor />
          two t<focus />
          hree
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one two
          <anchor /> t<focus />
          hree
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-start-expanded-reverse', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'start', reverse: true })
    }
    const input = (
      <editor>
        <block>
          one <anchor />
          two t<focus />
          hree
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one
          <anchor /> two t<focus />
          hree
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-start-expanded', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'start' })
    }
    const input = (
      <editor>
        <block>
          one <anchor />
          two t<focus />
          hree
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one t<anchor />
          wo t<focus />
          hree
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-start-from-backward', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'start', distance: 7 })
    }
    const input = (
      <editor>
        <block>
          one <focus />
          two t<anchor />
          hree
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one two t<anchor />
          hr
          <focus />
          ee
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('move-start-to-backward', () => {
    const run = editor => {
      Transforms.move(editor, { edge: 'start', distance: 8 })
    }
    const input = (
      <editor>
        <block>
          one <anchor />
          two t<focus />
          hree
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          one two t<focus />
          hre
          <anchor />e
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })
})
