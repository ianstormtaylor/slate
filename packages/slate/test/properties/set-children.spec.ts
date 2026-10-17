import assert from 'assert'
import * as fc from 'fast-check'
import { Transforms } from 'slate'
import { withHistory } from 'slate-history'
import { create, document, points, rangeFrom } from './generators'
import { assertNormalized, assertValidSelection, settings } from './checks'

it('setChildren maps generated documents and history without invalid selections', () => {
  fc.assert(
    fc.property(document, document, fc.nat(), (a, b, index) => {
      const editor = withHistory(create(a))
      Transforms.select(editor, rangeFrom(points(editor), index, index + 1))
      const start = structuredClone(editor.children)
      editor.operations = []
      Transforms.setChildren(editor, structuredClone(start))
      assert.deepStrictEqual(editor.operations, [])
      Transforms.setChildren(editor, structuredClone(b))
      assert.deepStrictEqual(editor.children, create(b).children)
      assertNormalized(editor)
      assertValidSelection(editor)
      if (editor.history.undos.length) editor.undo()
      assert.deepStrictEqual(editor.children, start)
      assertValidSelection(editor)
    }),
    settings
  )
})

it('setChildren preserves generated shared moves and their undo', () => {
  fc.assert(
    fc.property(document, fc.nat(), (a, index) => {
      const editor = withHistory(create(a))
      Transforms.select(editor, rangeFrom(points(editor), index, index + 1))
      const start = structuredClone(editor.children)
      const first = editor.children[0]
      const next = [
        ...editor.children.slice(1).reverse(),
        { type: 'container', children: [first] },
      ]
      const expected = create(next).children
      Transforms.setChildren(editor, next)
      assert.deepStrictEqual(editor.children, expected)
      assertNormalized(editor)
      assertValidSelection(editor)
      editor.undo()
      assert.deepStrictEqual(editor.children, start)
      assertValidSelection(editor)
    }),
    settings
  )
})
