import assert from 'assert'
import * as fc from 'fast-check'
import { Range, Transforms } from 'slate'
import { HistoryEditor, withHistory } from 'slate-history'
import { create, document, points, rangeFrom } from './generators'
import { assertNormalized, assertValidSelection, settings } from './checks'
import { highLevelCommand, runTransform } from './high-level'

for (const mode of ['default', 'withoutMerging', 'withNewBatch'] as const) {
  it(`history restores generated transform sequences with ${mode}`, () => {
    fc.assert(
      fc.property(
        document,
        fc.array(highLevelCommand, { minLength: 1, maxLength: 10 }),
        (children, commands) => {
          const editor = withHistory(create(children))
          const first = commands[0].input
          Transforms.select(
            editor,
            rangeFrom(points(editor), first.index, first.position)
          )
          const start = structuredClone(editor.children)
          for (const { name, input } of commands) {
            const run = () => runTransform(editor, name, input)
            if (mode === 'default') run()
            else if (mode === 'withoutMerging')
              HistoryEditor.withoutMerging(editor, run)
            else HistoryEditor.withNewBatch(editor, run)
          }
          const end = structuredClone(editor.children)
          const last = editor.history.undos[editor.history.undos.length - 1]
          let redoSelection = last?.selectionBefore
          for (const operation of last?.operations || []) {
            if (redoSelection)
              redoSelection = Range.transform(redoSelection, operation, {
                affinity: 'forward',
              })
          }
          const undoSelection = editor.history.undos[0]?.selectionBefore
          const count = editor.history.undos.length
          for (let index = 0; index < count; index++) editor.undo()
          assert.deepStrictEqual(editor.children, start)
          if (undoSelection)
            assert.deepStrictEqual(editor.selection, undoSelection)
          assertValidSelection(editor)
          assertNormalized(editor)
          for (let index = 0; index < count; index++) editor.redo()
          assert.deepStrictEqual(editor.children, end)
          if (redoSelection && editor.selection)
            assert.deepStrictEqual(editor.selection, redoSelection)
          assertValidSelection(editor)
          assertNormalized(editor)
        }
      ),
      settings
    )
  })
}
