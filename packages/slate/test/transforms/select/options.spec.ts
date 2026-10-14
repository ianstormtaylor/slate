import assert from 'assert'
import { createEditor, Transforms } from 'slate'

const create = () => {
  const editor = createEditor()
  editor.children = ['one', 'two', 'three'].map(text => ({
    children: [{ text }],
  }))
  Transforms.select(editor, { path: [0, 0], offset: 1 })
  return editor
}

const cases = [
  {
    name: 'insertText',
    run: (editor, select) =>
      Transforms.insertText(editor, 'X', {
        at: { path: [1, 0], offset: 1 },
        select,
      }),
    point: { path: [1, 0], offset: 2 },
  },
  {
    name: 'insertFragment',
    run: (editor, select) =>
      Transforms.insertFragment(editor, [{ children: [{ text: 'X' }] }], {
        at: { path: [1, 0], offset: 1 },
        select,
      }),
    point: { path: [1, 0], offset: 2 },
  },
  {
    name: 'splitNodes',
    run: (editor, select) =>
      Transforms.splitNodes(editor, {
        at: { path: [1, 0], offset: 1 },
        select,
      }),
    point: { path: [2, 0], offset: 0 },
  },
  {
    name: 'moveNodes',
    run: (editor, select) =>
      Transforms.moveNodes(editor, { at: [1], to: [2], select }),
    point: { path: [2, 0], offset: 3 },
  },
]

for (const { name, run, point } of cases) {
  describe(`${name} select`, () => {
    it('selects the result at an explicit location', () => {
      const editor = create()
      run(editor, true)
      assert.deepStrictEqual(editor.selection, { anchor: point, focus: point })
      assert.strictEqual(editor.pointRefs().size, 0)
      assert.strictEqual(editor.pathRefs().size, 0)
    })
    for (const select of [false, undefined]) {
      it(`retains an unrelated selection with select ${select}`, () => {
        const editor = create()
        const selection = editor.selection
        run(editor, select)
        assert.deepStrictEqual(editor.selection, selection)
      })
    }
  })
}

it('moveNodes retains the selection within implicitly moved content', () => {
  const editor = create()
  Transforms.moveNodes(editor, { to: [2] })
  const point = { path: [2, 0], offset: 1 }
  assert.deepStrictEqual(editor.selection, { anchor: point, focus: point })
})

it('insertText collapses the selection into an explicit replaced range by default', () => {
  const editor = create()
  Transforms.insertText(editor, 'X', { at: [1] })
  const point = { path: [1, 0], offset: 1 }
  assert.deepStrictEqual(editor.selection, { anchor: point, focus: point })
})

it('insertText keeps the selection with select false for an explicit range', () => {
  const editor = create()
  const selection = editor.selection
  Transforms.insertText(editor, 'X', { at: [1], select: false })
  assert.deepStrictEqual(editor.selection, selection)
})

it('insertText does not create a selection implicitly', () => {
  const editor = create()
  Transforms.deselect(editor)
  Transforms.insertText(editor, 'X')
  assert.strictEqual(editor.selection, null)
})

it('insertText can select explicitly when the editor has no selection', () => {
  const editor = create()
  Transforms.deselect(editor)
  Transforms.insertText(editor, 'X', { select: true })
  const point = { path: [2, 0], offset: 6 }
  assert.deepStrictEqual(editor.selection, { anchor: point, focus: point })
})

it('liftNodes selects the lifted result at an explicit location', () => {
  const editor = create()
  editor.children = [
    { children: [{ text: 'one' }] },
    { children: [{ children: [{ text: 'two' }] }] },
  ]
  Transforms.liftNodes(editor, { at: [1, 0], select: true })
  const point = { path: [1, 0], offset: 3 }
  assert.deepStrictEqual(editor.selection, { anchor: point, focus: point })
  assert.strictEqual(editor.pathRefs().size, 0)
})
