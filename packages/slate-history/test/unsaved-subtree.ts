import assert from 'assert'
import { createEditor, Descendant, Element, Node, Transforms } from 'slate'
import { HistoryEditor, withHistory } from '..'

const block = (text: string): Element => ({
  type: 'paragraph',
  children: [{ text }],
})

const setup = () => {
  const editor = withHistory(createEditor())
  editor.children = [block('existing'), block('outside')]
  return editor
}

const snapshot = (editor: HistoryEditor): Descendant[] =>
  JSON.parse(JSON.stringify(editor.children))

const insert = (editor: HistoryEditor) =>
  HistoryEditor.withNewBatch(editor, () =>
    Transforms.insertNodes(
      editor,
      { type: 'quote', children: [block('local'), block('second')] },
      { at: [1] }
    )
  )

const edits: [string, (editor: HistoryEditor) => void][] = [
  [
    'insert text',
    editor =>
      Transforms.insertText(editor, ' EXTERNAL', {
        at: { path: [1, 0, 0], offset: 5 },
      }),
  ],
  [
    'remove text',
    editor =>
      Transforms.delete(editor, {
        at: {
          anchor: { path: [1, 0, 0], offset: 1 },
          focus: { path: [1, 0, 0], offset: 4 },
        },
      }),
  ],
  [
    'set descendant properties',
    editor => Transforms.setNodes(editor, { bold: true }, { at: [1, 0, 0] }),
  ],
  [
    'insert a child',
    editor => Transforms.insertNodes(editor, block('EXTERNAL'), { at: [1, 1] }),
  ],
  ['remove a child', editor => Transforms.removeNodes(editor, { at: [1, 1] })],
  [
    'split a child',
    editor =>
      Transforms.splitNodes(editor, {
        at: { path: [1, 0, 0], offset: 2 },
        match: node => Element.isElement(node) && node.type === 'paragraph',
      }),
  ],
  [
    'set container properties',
    editor =>
      Transforms.setNodes(editor, { type: 'changed-quote' }, { at: [1] }),
  ],
  [
    'split the container',
    editor =>
      Transforms.splitNodes(editor, {
        at: [1, 1],
        match: node => Element.isElement(node) && node.type === 'quote',
      }),
  ],
  ['merge children', editor => Transforms.mergeNodes(editor, { at: [1, 1] })],
  [
    'move a child within the subtree',
    editor => Transforms.moveNodes(editor, { at: [1, 1], to: [1, 0] }),
  ],
  [
    'move a child out of the subtree',
    editor => Transforms.moveNodes(editor, { at: [1, 1], to: [2] }),
  ],
  [
    'move a node into the subtree',
    editor => Transforms.moveNodes(editor, { at: [2], to: [1, 1] }),
  ],
]

describe('history with unsaved edits inside inserted nodes', () => {
  for (const [name, edit] of edits) {
    it(`drops the conflicting insertion batch after an unsaved ${name}`, () => {
      const editor = setup()
      insert(editor)
      HistoryEditor.withoutSaving(editor, () => edit(editor))
      const expected = snapshot(editor)
      assert.strictEqual(editor.history.undos.length, 0)
      editor.undo()
      assert.deepStrictEqual(editor.children, expected)
      editor.redo()
      assert.deepStrictEqual(editor.children, expected)
    })
  }

  it('keeps a sibling merged into the inserted container without saving', () => {
    const editor = setup()
    editor.children[1] = { type: 'quote', children: [block('EXTERNAL')] }
    insert(editor)
    HistoryEditor.withoutSaving(editor, () =>
      Transforms.mergeNodes(editor, { at: [2] })
    )
    const expected = snapshot(editor)
    assert.strictEqual(editor.history.undos.length, 0)
    editor.undo()
    editor.redo()
    assert.deepStrictEqual(editor.children, expected)
  })

  it('keeps unsaved text in an inserted text node', () => {
    const editor = setup()
    Transforms.insertNodes(
      editor,
      { text: 'local', bold: true },
      { at: [0, 1] }
    )
    HistoryEditor.withoutSaving(editor, () =>
      Transforms.insertText(editor, ' EXTERNAL', {
        at: { path: [0, 1], offset: 5 },
      })
    )
    const expected = snapshot(editor)
    editor.undo()
    editor.redo()
    assert.deepStrictEqual(editor.children, expected)
    assert.strictEqual(editor.history.undos.length, 0)
  })

  it('keeps unsaved text at deeper descendant paths', () => {
    const editor = setup()
    Transforms.insertNodes(
      editor,
      {
        type: 'quote',
        children: [{ type: 'quote', children: [block('local')] }],
      },
      { at: [1] }
    )
    HistoryEditor.withoutSaving(editor, () =>
      Transforms.insertText(editor, ' EXTERNAL', {
        at: { path: [1, 0, 0, 0], offset: 5 },
      })
    )
    const expected = snapshot(editor)
    editor.undo()
    editor.redo()
    assert.deepStrictEqual(editor.children, expected)
  })

  it('drops the entire conflicting batch but keeps neighboring batches and selections', () => {
    const editor = setup()
    Transforms.select(editor, { path: [0, 0], offset: 8 })
    HistoryEditor.withNewBatch(editor, () => editor.insertText('a'))
    const older = editor.history.undos[0]
    HistoryEditor.withNewBatch(editor, () => {
      insert(editor)
      Transforms.insertText(editor, 'batched', {
        at: { path: [2, 0], offset: 7 },
      })
    })
    Transforms.select(editor, { path: [0, 0], offset: 9 })
    HistoryEditor.withNewBatch(editor, () => editor.insertText('b'))
    const newer = editor.history.undos[2]
    const newerOp = newer.operations[0]
    HistoryEditor.withoutSaving(editor, () =>
      Transforms.insertText(editor, ' EXTERNAL', {
        at: { path: [1, 0, 0], offset: 5 },
      })
    )
    assert.deepStrictEqual(editor.history.undos, [older, newer])
    assert.strictEqual(newer.operations[0], newerOp)
    editor.undo()
    assert.deepStrictEqual(editor.selection?.anchor, {
      path: [0, 0],
      offset: 9,
    })
    editor.undo()
    assert.strictEqual(Node.string(editor.children[0]), 'existing')
    assert.strictEqual(Node.string(Node.get(editor, [1, 0])), 'local EXTERNAL')
    assert.strictEqual(Node.string(editor.children[2]), 'outsidebatched')
    editor.redo()
    editor.redo()
    assert.strictEqual(Node.string(editor.children[0]), 'existingab')
    assert.deepStrictEqual(editor.history.undos, [older, newer])
  })

  it('drops a conflicting redo removal after editing the restored subtree', () => {
    const editor = setup()
    Transforms.removeNodes(editor, { at: [1] })
    editor.undo()
    HistoryEditor.withoutSaving(editor, () =>
      Transforms.insertText(editor, ' EXTERNAL', {
        at: { path: [1, 0], offset: 7 },
      })
    )
    const expected = snapshot(editor)
    assert.strictEqual(editor.history.redos.length, 0)
    editor.redo()
    assert.deepStrictEqual(editor.children, expected)
  })

  it('still undoes and redoes an inserted subtree without unsaved edits', () => {
    const editor = setup()
    const before = snapshot(editor)
    insert(editor)
    const inserted = snapshot(editor)
    editor.undo()
    assert.deepStrictEqual(editor.children, before)
    editor.redo()
    assert.deepStrictEqual(editor.children, inserted)
  })

  it('keeps unsaved sibling nodes while undoing the inserted subtree', () => {
    const editor = setup()
    insert(editor)
    HistoryEditor.withoutSaving(editor, () =>
      Transforms.insertNodes(editor, block('EXTERNAL'), { at: [2] })
    )
    const inserted = snapshot(editor)
    editor.undo()
    assert.deepStrictEqual(editor.children, [
      block('existing'),
      block('EXTERNAL'),
      block('outside'),
    ])
    editor.redo()
    assert.deepStrictEqual(editor.children, inserted)
  })

  it('still removes saved text around text inserted without saving', () => {
    const editor = setup()
    Transforms.insertText(editor, 'LOCAL', { at: { path: [0, 0], offset: 0 } })
    HistoryEditor.withoutSaving(editor, () =>
      Transforms.insertText(editor, 'EXTERNAL', {
        at: { path: [0, 0], offset: 2 },
      })
    )
    editor.undo()
    assert.deepStrictEqual(editor.children, [
      block('EXTERNALexisting'),
      block('outside'),
    ])
    editor.redo()
    assert.deepStrictEqual(editor.children, [
      block('LOEXTERNALCALexisting'),
      block('outside'),
    ])
  })

  it('keeps an unrelated redo insertion and operation identity', () => {
    const editor = setup()
    insert(editor)
    editor.undo()
    const batch = editor.history.redos[0]
    const op = batch.operations[0]
    HistoryEditor.withoutSaving(editor, () =>
      Transforms.insertText(editor, ' EXTERNAL', {
        at: { path: [0, 0], offset: 8 },
      })
    )
    assert.strictEqual(batch.operations[0], op)
    editor.redo()
    assert.deepStrictEqual(editor.children, [
      block('existing EXTERNAL'),
      { type: 'quote', children: [block('local'), block('second')] },
      block('outside'),
    ])
  })

  it('does not treat selection changes or relocating the whole subtree as edits inside it', () => {
    const editor = setup()
    insert(editor)
    HistoryEditor.withoutSaving(editor, () => {
      Transforms.select(editor, { path: [1, 0, 0], offset: 2 })
      Transforms.moveNodes(editor, { at: [1], to: [0] })
    })
    assert.strictEqual(editor.history.undos.length, 1)
    const inserted = snapshot(editor)
    editor.undo()
    assert.deepStrictEqual(editor.children, [
      block('existing'),
      block('outside'),
    ])
    editor.redo()
    assert.deepStrictEqual(editor.children, inserted)
  })
})
