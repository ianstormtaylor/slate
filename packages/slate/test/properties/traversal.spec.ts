import assert from 'assert'
import * as fc from 'fast-check'
import { Editor, Element, Node, Point, Transforms } from 'slate'
import { create, document, rawDocument } from './generators'
import { assertNormalized, assertValidSelection, settings } from './checks'

for (const unit of ['character', 'word', 'line', 'block'] as const) {
  for (const voids of [false, true]) {
    if (unit === 'character' && voids) continue
    it(`${unit} positions agree with directional movement with voids ${voids}`, () => {
      fc.assert(
        fc.property(document, children => {
          const editor = create(children)
          for (const reverse of [false, true]) {
            const positions = Array.from(
              Editor.positions(editor, { at: [], unit, voids, reverse })
            )
            for (let index = 1; index < positions.length; index++) {
              assert.strictEqual(
                Point.compare(positions[index - 1], positions[index]),
                reverse ? 1 : -1
              )
              const next = (reverse ? Editor.before : Editor.after)(
                editor,
                positions[index - 1],
                { unit, voids }
              )
              assert.deepStrictEqual(next, positions[index])
            }
          }
        }),
        settings
      )
    })
  }
}

it('a custom paragraph normalizer terminates and stays idempotent', () => {
  fc.assert(
    fc.property(rawDocument, children => {
      const editor = create(
        [...children, { type: 'paragraph', children: [{ text: 'x' }] }],
        false
      )
      const { normalizeNode } = editor
      editor.normalizeNode = (entry, options) => {
        const [node, path] = entry
        if (
          Element.isElement(node) &&
          node.type === 'paragraph' &&
          Node.string(node) === 'x'
        ) {
          Transforms.setNodes(editor, { type: 'x-para' }, { at: path })
          return
        }
        normalizeNode(entry, options)
      }
      Editor.normalize(editor, { force: true })
      assertNormalized(editor)
      assertValidSelection(editor)
      for (const [node] of Node.descendants(editor)) {
        assert(
          !(
            Element.isElement(node) &&
            node.type === 'paragraph' &&
            Node.string(node) === 'x'
          )
        )
      }
      const before = structuredClone(editor.children)
      editor.operations = []
      Editor.normalize(editor, { force: true })
      assert.deepStrictEqual(editor.children, before)
      assert.deepStrictEqual(editor.operations, [])
    }),
    settings
  )
})
