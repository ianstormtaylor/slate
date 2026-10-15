import assert from 'assert'
import * as fc from 'fast-check'
import { Editor, Transforms } from 'slate'
import { command, create, document, points, rangeFrom } from './generators'
import { settings } from './checks'
import { runTransform, transformNames } from './high-level'

for (const name of transformNames) {
  it(`${name} preserves normalized structure, valid selections and outside text`, () => {
    fc.assert(
      fc.property(document, command, (children, input) => {
        const editor = create(children)
        Transforms.select(
          editor,
          rangeFrom(points(editor), input.index, input.position)
        )
        runTransform(editor, name, input)
      }),
      settings
    )
  })
}

it('generated incompatible sibling merges throw without changing the editor', () => {
  fc.assert(
    fc.property(document, command, (children, input) => {
      const paragraph = children[0]
      const container = { children: [structuredClone(paragraph)] }
      const editor = create(
        input.index % 2 ? [paragraph, container] : [container, paragraph]
      )
      Transforms.select(
        editor,
        rangeFrom(points(editor), input.index, input.position)
      )
      const before = structuredClone({
        children: editor.children,
        selection: editor.selection,
      })
      const count = editor.operations.length
      assert.throws(
        () => Transforms.mergeNodes(editor, { at: [1] }),
        /children are not the same kind/
      )
      assert.deepStrictEqual(editor.children, before.children)
      assert.deepStrictEqual(editor.selection, before.selection)
      assert.strictEqual(editor.operations.length, count)
      assert.strictEqual(Editor.pathRefs(editor).size, 0)
    }),
    settings
  )
})
