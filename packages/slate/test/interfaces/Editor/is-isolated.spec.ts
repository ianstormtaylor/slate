import assert from 'assert'
import {
  createEditor,
  Descendant,
  Editor,
  Element,
  Node,
  Point,
  Transforms,
} from 'slate'

type Block = { type: string; children: (Block | { text: string })[] }

const cell = (...children: Block['children']): Block => ({
  type: 'cell',
  children,
})
const p = (text: string): Block => ({
  type: 'paragraph',
  children: [{ text }],
})
const table = (...cells: Block[]): Block => ({
  type: 'table',
  children: [{ type: 'row', children: cells }],
})

const setup = (children: Block[], caret?: Point) => {
  const editor = createEditor()
  editor.children = JSON.parse(JSON.stringify(children)) as Descendant[]
  editor.isIsolated = element => (element as Block).type === 'cell'
  if (caret) {
    editor.selection = { anchor: caret, focus: caret }
  }
  return editor
}

const unchanged = (
  children: Block[],
  caret: Point,
  edit: (e: Editor) => void
) => {
  const editor = setup(children, caret)
  edit(editor)
  assert.deepStrictEqual(editor.children, children)
}

describe('Editor.isIsolated', () => {
  const twoCells = [table(cell({ text: 'ab' }), cell({ text: 'cd' }))]

  it('is false by default', () => {
    const editor = createEditor()
    assert.strictEqual(
      Editor.isIsolated(editor, { children: [{ text: '' }] }),
      false
    )
  })

  it('keeps Backspace at the start of a cell inside the cell', () => {
    unchanged(twoCells, { path: [0, 0, 1, 0], offset: 0 }, e =>
      e.deleteBackward('character')
    )
  })

  it('keeps Delete at the end of a cell inside the cell', () => {
    unchanged(twoCells, { path: [0, 0, 0, 0], offset: 2 }, e =>
      e.deleteForward('character')
    )
  })

  it('does not pull a following paragraph into the last cell', () => {
    const children = [...twoCells, p('after')]
    unchanged(children, { path: [1, 0], offset: 0 }, e =>
      e.deleteBackward('character')
    )
  })

  it('does not pull the first cell into a preceding paragraph', () => {
    const children = [p('before'), ...twoCells]
    unchanged(children, { path: [0, 0], offset: 6 }, e =>
      e.deleteForward('character')
    )
  })

  it('still deletes text and merges blocks within a cell', () => {
    const editor = setup(
      [table(cell(p('one'), p('two')), cell({ text: '' }))],
      {
        path: [0, 0, 0, 1, 0],
        offset: 0,
      }
    )
    editor.deleteBackward('character')
    assert.strictEqual(Editor.string(editor, [0, 0, 0]), 'onetwo')
    editor.deleteBackward('character')
    assert.strictEqual(Editor.string(editor, [0, 0, 0]), 'ontwo')
  })

  it('clamps word and line deletion to the cell', () => {
    const editor = setup(
      [table(cell({ text: 'keep' }), cell({ text: 'hello world' }))],
      { path: [0, 0, 1, 0], offset: 11 }
    )
    editor.deleteBackward('line')
    assert.strictEqual(Editor.string(editor, [0, 0, 0]), 'keep')
    assert.strictEqual(Editor.string(editor, [0, 0, 1]), '')
    assert.strictEqual((Node.get(editor, [0, 0]) as Element).children.length, 2)
  })

  it('trims both cells without merging them when deleting across them', () => {
    const editor = setup(twoCells)
    editor.selection = {
      anchor: { path: [0, 0, 0, 0], offset: 1 },
      focus: { path: [0, 0, 1, 0], offset: 1 },
    }
    editor.deleteFragment()
    assert.strictEqual(Editor.string(editor, [0, 0, 0]), 'a')
    assert.strictEqual(Editor.string(editor, [0, 0, 1]), 'd')
  })

  it('does not split a cell on insertBreak', () => {
    const editor = setup(twoCells, { path: [0, 0, 0, 0], offset: 1 })
    editor.insertBreak()
    assert.deepStrictEqual(editor.children, twoCells)
  })

  it('splits a paragraph inside a cell on insertBreak', () => {
    const editor = setup([table(cell(p('ab')))], {
      path: [0, 0, 0, 0, 0],
      offset: 1,
    })
    editor.insertBreak()
    assert.deepStrictEqual(editor.children, [table(cell(p('a'), p('b')))])
  })

  it('splits a cell when splitNodes matches it explicitly', () => {
    const editor = setup(twoCells, { path: [0, 0, 0, 0], offset: 1 })
    Transforms.splitNodes(editor, {
      match: n => (n as Block).type === 'cell',
    })
    assert.strictEqual((Node.get(editor, [0, 0]) as Element).children.length, 3)
  })

  it('does not delete into a nested isolated element', () => {
    const children = [
      table(cell(table(cell({ text: 'inner' })), p('outer')), cell(p('x'))),
    ]
    unchanged(children, { path: [0, 0, 0, 1, 0], offset: 0 }, e =>
      e.deleteBackward('character')
    )
  })

  it('merges across cells when nothing is isolated', () => {
    const editor = setup(twoCells, { path: [0, 0, 1, 0], offset: 0 })
    editor.isIsolated = () => false
    editor.deleteBackward('character')
    assert.strictEqual(Editor.string(editor, [0, 0, 0]), 'abcd')
  })
})
