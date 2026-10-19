import assert from 'assert'
import {
  createEditor,
  Descendant,
  Editor,
  Element,
  Node,
  Transforms,
} from 'slate'
import { HistoryEditor, withHistory } from '..'

const block = (text: string): Element => ({
  type: 'paragraph',
  children: [{ text }],
})

const setup = (children: Descendant[]) => {
  const editor = withHistory(createEditor())
  editor.children = children
  return editor
}

const strings = (editor: Editor) =>
  editor.children.map(node => Node.string(node))

const remote = (editor: HistoryEditor, fn: () => void) => {
  HistoryEditor.withNewBatch(editor, () => {})
  HistoryEditor.withoutSaving(editor, fn)
}

describe('undo after changes applied without saving', () => {
  it('reverts typing after a block is inserted above it', () => {
    const editor = setup([block('typed: ')])
    Transforms.select(editor, { path: [0, 0], offset: 7 })
    editor.insertText('abc')
    remote(editor, () =>
      Transforms.insertNodes(editor, block('streamed'), { at: [0] })
    )
    editor.undo()
    assert.deepStrictEqual(strings(editor), ['streamed', 'typed: '])
    assert.deepStrictEqual(editor.selection?.anchor, {
      path: [1, 0],
      offset: 7,
    })
  })

  it('reverts typing after text is inserted before it in the same text', () => {
    const editor = setup([block('hello')])
    Transforms.select(editor, { path: [0, 0], offset: 5 })
    editor.insertText('abc')
    remote(editor, () =>
      Transforms.insertText(editor, 'X', { at: { path: [0, 0], offset: 0 } })
    )
    editor.undo()
    assert.deepStrictEqual(strings(editor), ['Xhello'])
  })

  it('keeps text inserted inside the typed text', () => {
    const editor = setup([block('hello')])
    Transforms.select(editor, { path: [0, 0], offset: 5 })
    editor.insertText('abc')
    remote(editor, () =>
      Transforms.insertText(editor, 'Z', { at: { path: [0, 0], offset: 6 } })
    )
    editor.undo()
    assert.deepStrictEqual(strings(editor), ['helloZ'])
  })

  it('reverts only the typed text that is left after a removal', () => {
    const editor = setup([block('hello')])
    Transforms.select(editor, { path: [0, 0], offset: 5 })
    editor.insertText('abc')
    remote(editor, () =>
      Transforms.delete(editor, {
        at: {
          anchor: { path: [0, 0], offset: 6 },
          focus: { path: [0, 0], offset: 7 },
        },
      })
    )
    editor.undo()
    assert.deepStrictEqual(strings(editor), ['hello'])
  })

  it('drops an undo step whose block was removed', () => {
    const editor = setup([block('one'), block('two')])
    Transforms.select(editor, { path: [1, 0], offset: 3 })
    editor.insertText('!')
    remote(editor, () => Transforms.removeNodes(editor, { at: [1] }))
    assert.strictEqual(editor.history.undos.length, 0)
    editor.undo()
    assert.deepStrictEqual(strings(editor), ['one'])
  })

  it('reverts a split after a block is inserted above it', () => {
    const editor = setup([block('hello')])
    Transforms.select(editor, { path: [0, 0], offset: 2 })
    editor.insertBreak()
    remote(editor, () =>
      Transforms.insertNodes(editor, block('top'), { at: [0] })
    )
    editor.undo()
    assert.deepStrictEqual(strings(editor), ['top', 'hello'])
  })

  it('reverts two steps in different blocks after an insert above both', () => {
    const editor = setup([block('a'), block('b')])
    Transforms.select(editor, { path: [0, 0], offset: 1 })
    editor.insertText('1')
    HistoryEditor.withNewBatch(editor, () => {})
    Transforms.select(editor, { path: [1, 0], offset: 1 })
    editor.insertText('2')
    remote(editor, () =>
      Transforms.insertNodes(editor, block('top'), { at: [0] })
    )
    editor.undo()
    editor.undo()
    assert.deepStrictEqual(strings(editor), ['top', 'a', 'b'])
  })

  it('redoes in the right block after an insert above it', () => {
    const editor = setup([block('a')])
    Transforms.select(editor, { path: [0, 0], offset: 1 })
    editor.insertText('bc')
    editor.undo()
    remote(editor, () =>
      Transforms.insertNodes(editor, block('top'), { at: [0] })
    )
    editor.redo()
    assert.deepStrictEqual(strings(editor), ['top', 'abc'])
  })

  it('does not change history while undoing and redoing', () => {
    const editor = setup([block('a')])
    Transforms.select(editor, { path: [0, 0], offset: 1 })
    editor.insertText('b')
    HistoryEditor.withNewBatch(editor, () => {})
    editor.insertText('c')
    editor.undo()
    editor.undo()
    editor.redo()
    editor.redo()
    assert.deepStrictEqual(strings(editor), ['abc'])
    editor.undo()
    editor.undo()
    assert.deepStrictEqual(strings(editor), ['a'])
  })
})

describe('undo after random changes applied without saving', () => {
  const random = (seed: number) => () => {
    seed = (seed * 1103515245 + 12345) % 2147483648
    return seed / 2147483648
  }

  for (let seed = 1; seed <= 1000; seed++) {
    it(`removes only local edits, seed ${seed}`, () => {
      const next = random(seed)
      const pick = (n: number) => Math.floor(next() * n)
      const editor = setup([block('aa'), block('bb'), block('cc')])
      let remoteBlocks = 0
      let remoteChars = 0
      const point = () => {
        const index = pick(editor.children.length)
        const text = Node.string(editor.children[index])
        return { path: [index, 0], offset: pick(text.length + 1) }
      }
      for (let step = 0; step < 20; step++) {
        const kind = pick(4)
        if (kind === 0) {
          HistoryEditor.withNewBatch(editor, () => {
            Transforms.select(editor, point())
            editor.insertText('L')
          })
        } else if (kind === 1) {
          HistoryEditor.withNewBatch(editor, () => {
            Transforms.select(editor, point())
            editor.insertBreak()
          })
        } else if (kind === 2) {
          remote(editor, () =>
            Transforms.insertNodes(editor, block('R'), {
              at: [pick(editor.children.length + 1)],
            })
          )
          remoteBlocks++
          remoteChars++
        } else {
          remote(editor, () =>
            Transforms.insertText(editor, 'R', { at: point() })
          )
          remoteChars++
        }
      }
      while (editor.history.undos.length) editor.undo()
      const text = strings(editor).join('')
      assert.ok(!text.includes('L'), JSON.stringify(strings(editor)))
      assert.strictEqual(text.split('R').length - 1, remoteChars)
      assert.ok(editor.children.length >= 3 + remoteBlocks)
    })
  }
})

describe('merging after changes applied without saving', () => {
  it('keeps the same operation objects when an unsaved change does not move them', () => {
    const editor = setup([block('a'), block('b')])
    Transforms.select(editor, { path: [0, 0], offset: 1 })
    editor.insertText('x')
    const [op] = editor.history.undos[0].operations
    HistoryEditor.withoutSaving(editor, () =>
      Transforms.insertText(editor, 'R', { at: { path: [1, 0], offset: 1 } })
    )
    assert.strictEqual(editor.history.undos[0].operations[0], op)
  })

  it('keeps typing in one step when an unsaved change lands elsewhere in the same tick', () => {
    const editor = setup([block('a'), block('b')])
    Transforms.select(editor, { path: [0, 0], offset: 1 })
    editor.insertText('x')
    HistoryEditor.withoutSaving(editor, () =>
      Transforms.insertText(editor, 'R', { at: { path: [1, 0], offset: 1 } })
    )
    editor.insertText('y')
    assert.strictEqual(editor.history.undos.length, 1)
    editor.undo()
    assert.deepStrictEqual(strings(editor), ['a', 'bR'])
  })
})
