import assert from 'assert'
import * as fc from 'fast-check'
import { Editor, Element, Path } from 'slate'
import { create, document, points } from './generators'
import { settings } from './checks'

it('insertion points are stable, block-local and unchanged without affinity', () => {
  fc.assert(
    fc.property(
      document,
      fc.constantFrom('inside', 'outside', null),
      fc.constantFrom('inside', 'outside', null),
      fc.constantFrom('backward', 'forward', null),
      (children, inline, inlineEnd, leaf) => {
        const editor = create(children)
        editor.inlineEdgeAffinity = (element, edge) =>
          edge === 'start' ? inline : inlineEnd
        editor.leafEdgeAffinity = () => leaf
        for (const point of points(editor)) {
          const result = Editor.insertionPoint(editor, point)
          assert.deepStrictEqual(Editor.insertionPoint(editor, result), result)
          const block = (at: typeof point) =>
            Editor.above(editor, {
              at,
              match: n => Element.isElement(n) && Editor.isBlock(editor, n),
              voids: true,
            })![1]
          assert(Path.equals(block(point), block(result)))
          if (inline === null && inlineEnd === null && leaf === null)
            assert.deepStrictEqual(result, point)
        }
      }
    ),
    settings
  )
})
