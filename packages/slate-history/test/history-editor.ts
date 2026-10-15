import assert from 'assert'
import { createEditor, Descendant, Editor, Transforms } from 'slate'
import { HistoryEditor, withHistory } from '..'

const boom = () => {
  throw new Error('boom')
}

const createTestEditor = (children: Descendant[]) => {
  const editor = withHistory(createEditor())
  editor.isInline = element => element.inline === true
  editor.isVoid = element => element.void === true
  editor.children = children
  return editor
}

const undoAll = (editor: HistoryEditor) => {
  while (editor.history.undos.length) {
    editor.undo()
  }
}

describe('HistoryEditor', () => {
  describe('withMerging', () => {
    it('restores the merging flag when fn throws', () => {
      const editor = withHistory(createEditor())
      assert.throws(() => HistoryEditor.withMerging(editor, boom), /boom/)
      assert.strictEqual(HistoryEditor.isMerging(editor), undefined)
    })
  })

  describe('withNewBatch', () => {
    it('restores the merging and splitting flags when fn throws', () => {
      const editor = withHistory(createEditor())
      assert.throws(() => HistoryEditor.withNewBatch(editor, boom), /boom/)
      assert.strictEqual(HistoryEditor.isMerging(editor), undefined)
      assert.strictEqual(HistoryEditor.isSplittingOnce(editor), undefined)
    })
  })

  describe('withoutMerging', () => {
    it('restores the merging flag when fn throws', () => {
      const editor = withHistory(createEditor())
      assert.throws(() => HistoryEditor.withoutMerging(editor, boom), /boom/)
      assert.strictEqual(HistoryEditor.isMerging(editor), undefined)
    })

    it('keeps each transform separate and adjacent typing unmerged', () => {
      const editor = createTestEditor([{ children: [{ text: '' }] }])
      Transforms.select(editor, Editor.start(editor, []))

      HistoryEditor.withoutMerging(editor, () => {
        Transforms.insertText(editor, 'a')
        Transforms.insertText(editor, 'b')
      })

      assert.strictEqual(editor.history.undos.length, 2)
      editor.undo()
      assert.deepEqual(editor.children, [{ children: [{ text: 'a' }] }])
    })

    it('keeps normalization in the same undo step as its transform', () => {
      const editor = createTestEditor([{ children: [{ text: 'a' }] }])
      const point = { path: [0, 0], offset: 0 }

      HistoryEditor.withoutMerging(editor, () => {
        Transforms.wrapNodes(
          editor,
          { inline: true, children: [] },
          { at: { anchor: point, focus: point }, split: true, voids: true }
        )
      })

      assert.strictEqual(editor.history.undos.length, 1)
      undoAll(editor)
      assert.deepEqual(editor.children, [{ children: [{ text: 'a' }] }])
    })

    it('restores a valid selection when undoing a merge into a void', () => {
      const children: Descendant[] = [
        { children: [{ text: 'a' }] },
        { void: true, children: [{ text: '' }] },
      ]
      const selection = {
        anchor: { path: [1, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      }
      const editor = createTestEditor(structuredClone(children))
      editor.selection = selection

      HistoryEditor.withoutMerging(editor, () => {
        Transforms.delete(editor, {
          at: { path: [1, 0], offset: 0 },
          reverse: true,
          unit: 'character',
          distance: 1,
          voids: true,
        })
      })
      undoAll(editor)

      assert.deepEqual(editor.children, children)
      assert.deepEqual(editor.selection, selection)
    })

    it('splits steps at the end of an outer normalization scope', () => {
      const editor = createTestEditor([{ children: [{ text: '' }] }])
      Transforms.select(editor, Editor.start(editor, []))

      HistoryEditor.withoutMerging(editor, () => {
        Editor.withoutNormalizing(editor, () => {
          Transforms.insertText(editor, 'a')
          Transforms.insertNodes(editor, {
            inline: true,
            children: [{ text: 'x' }],
          })
        })
        Transforms.insertText(editor, 'b', { at: Editor.end(editor, []) })
      })

      assert.strictEqual(editor.history.undos.length, 2)
      undoAll(editor)
      assert.deepEqual(editor.children, [{ children: [{ text: '' }] }])
    })
  })

  describe('withoutSaving', () => {
    it('restores the saving flag when fn throws', () => {
      const editor = withHistory(createEditor())
      assert.throws(() => HistoryEditor.withoutSaving(editor, boom), /boom/)
      assert.strictEqual(HistoryEditor.isSaving(editor), undefined)
    })
  })
})
