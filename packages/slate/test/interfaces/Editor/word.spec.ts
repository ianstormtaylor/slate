import assert from 'assert'
import { createEditor, Descendant, Editor, Element, Range } from 'slate'

const setup = (children: object[]) => {
  const editor = createEditor()
  editor.children = children as Descendant[]
  editor.isInline = element =>
    ['link', 'mention'].includes((element as { type?: string }).type ?? '')
  editor.isVoid = element =>
    ['mention', 'image'].includes((element as { type?: string }).type ?? '')
  return editor
}

const textOf = (editor: Editor, range: Range | undefined) =>
  range && Editor.string(editor, range)

const paragraph = (text: string) => ({ children: [{ text }] })

describe('Editor.word', () => {
  it('returns the word around a caret', () => {
    const editor = setup([paragraph('hello brave world')])
    for (const offset of [6, 8, 11]) {
      const range = Editor.word(editor, { at: { path: [0, 0], offset } })
      assert.deepStrictEqual(range, {
        anchor: { path: [0, 0], offset: 6 },
        focus: { path: [0, 0], offset: 11 },
      })
    }
  })

  it('returns the word ending at the caret at the end of the block', () => {
    const editor = setup([paragraph('hello world'), paragraph('next')])
    const range = Editor.word(editor, { at: { path: [0, 0], offset: 11 } })
    assert.strictEqual(textOf(editor, range), 'world')
  })

  it('returns undefined between spaces and in an empty block', () => {
    const editor = setup([paragraph('one  two'), paragraph('')])
    assert.strictEqual(
      Editor.word(editor, { at: { path: [0, 0], offset: 4 } }),
      undefined
    )
    assert.strictEqual(
      Editor.word(editor, { at: { path: [1, 0], offset: 0 } }),
      undefined
    )
  })

  it('stops at punctuation by default and accepts a custom character test', () => {
    const editor = setup([paragraph('see foo-bar.baz now')])
    const at = { path: [0, 0], offset: 9 }
    assert.strictEqual(
      textOf(editor, Editor.word(editor, { at: { path: [0, 0], offset: 5 } })),
      'foo'
    )
    assert.strictEqual(
      textOf(
        editor,
        Editor.word(editor, { at, isWordCharacter: c => /[\w.-]/.test(c) })
      ),
      'foo-bar.baz'
    )
  })

  it('keeps apostrophes inside words', () => {
    const editor = setup([paragraph("it don't matter")])
    const range = Editor.word(editor, { at: { path: [0, 0], offset: 5 } })
    assert.strictEqual(textOf(editor, range), "don't")
  })

  it('spans text nodes with different marks and inline links', () => {
    const editor = setup([
      {
        children: [
          { text: 'say he' },
          { text: 'll', bold: true },
          { type: 'link', children: [{ text: 'o there' }] },
          { text: '' },
        ],
      },
    ])
    const range = Editor.word(editor, { at: { path: [0, 1], offset: 1 } })
    assert.deepStrictEqual(range, {
      anchor: { path: [0, 0], offset: 4 },
      focus: { path: [0, 2, 0], offset: 1 },
    })
    assert.strictEqual(textOf(editor, range), 'hello')
  })

  it('stops at inline voids and returns undefined inside them', () => {
    const editor = setup([
      {
        children: [
          { text: 'ab' },
          { type: 'mention', children: [{ text: '' }] },
          { text: 'cd' },
        ],
      },
    ])
    assert.strictEqual(
      textOf(editor, Editor.word(editor, { at: { path: [0, 2], offset: 1 } })),
      'cd'
    )
    assert.strictEqual(
      textOf(editor, Editor.word(editor, { at: { path: [0, 0], offset: 2 } })),
      'ab'
    )
    assert.strictEqual(
      Editor.word(editor, { at: { path: [0, 1, 0], offset: 0 } }),
      undefined
    )
  })

  it('treats emoji as word characters like the word unit does', () => {
    const editor = setup([paragraph('go 👍🏽ok now')])
    assert.strictEqual(
      textOf(editor, Editor.word(editor, { at: { path: [0, 0], offset: 9 } })),
      'ok'
    )
    assert.strictEqual(
      textOf(editor, Editor.word(editor, { at: { path: [0, 0], offset: 5 } })),
      '👍🏽ok'
    )
  })

  it('deletes and moves one word at a time in scripts written without spaces', () => {
    const editor = setup([paragraph('今日は良い天気です')])
    editor.selection = {
      anchor: { path: [0, 0], offset: 9 },
      focus: { path: [0, 0], offset: 9 },
    }
    editor.deleteBackward('word')
    assert.strictEqual(Editor.string(editor, [0]), '今日は良い天気')
    editor.deleteBackward('word')
    assert.strictEqual(Editor.string(editor, [0]), '今日は良い')
    assert.deepStrictEqual(
      Editor.after(editor, { path: [0, 0], offset: 0 }, { unit: 'word' }),
      { path: [0, 0], offset: 2 }
    )
  })

  it('finds words in scripts written without spaces', () => {
    const cases: [string, number, string][] = [
      ['今日は良い天気です。', 4, '良い'],
      ['我们今天去公园散步，好吗', 3, '今天'],
      ['วันนี้อากาศดีมาก', 4, 'นี้'],
    ]
    for (const [text, offset, word] of cases) {
      const editor = setup([paragraph(text)])
      const range = Editor.word(editor, { at: { path: [0, 0], offset } })
      assert.strictEqual(textOf(editor, range), word)
    }
  })

  it('falls back to the word unit rules without Intl.Segmenter', () => {
    const { Segmenter } = Intl
    Object.defineProperty(Intl, 'Segmenter', {
      value: undefined,
      configurable: true,
      writable: true,
    })
    try {
      const editor = setup([
        paragraph('see foo-bar.baz now'),
        paragraph('今日は良い天気です。'),
      ])
      assert.strictEqual(
        textOf(
          editor,
          Editor.word(editor, { at: { path: [0, 0], offset: 9 } })
        ),
        'bar'
      )
      assert.strictEqual(
        textOf(
          editor,
          Editor.word(editor, { at: { path: [1, 0], offset: 4 } })
        ),
        '今日は良い天気です'
      )
    } finally {
      Object.defineProperty(Intl, 'Segmenter', {
        value: Segmenter,
        configurable: true,
        writable: true,
      })
    }
  })

  it('uses the selection focus by default', () => {
    const editor = setup([paragraph('alpha beta')])
    editor.selection = {
      anchor: { path: [0, 0], offset: 1 },
      focus: { path: [0, 0], offset: 8 },
    }
    assert.strictEqual(textOf(editor, Editor.word(editor)), 'beta')
    assert.strictEqual(textOf(editor, editor.word()), 'beta')
  })

  it('returns undefined without a selection or inside a void block', () => {
    const editor = setup([
      { type: 'image', children: [{ text: '' }] } as Element,
    ])
    assert.strictEqual(Editor.word(editor), undefined)
    assert.strictEqual(
      Editor.word(editor, { at: { path: [0, 0], offset: 0 } }),
      undefined
    )
  })
})
