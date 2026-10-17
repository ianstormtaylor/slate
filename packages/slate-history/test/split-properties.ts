import assert from 'assert'
import { createEditor, Element, Node, Transforms } from 'slate'
import { HistoryEditor, withHistory } from '..'

for (const policy of ['omit', 'replace'] as const) {
  for (const action of ['break', 'fragment', 'nested split'] as const) {
    it(`undo and redo preserve ids for ${action} when the split policy is ${policy}`, () => {
      const editor = withHistory(createEditor())
      const paragraph: Element = {
        type: 'paragraph',
        id: 'paragraph',
        children: [{ text: 'hello', bold: true }],
      }
      editor.children =
        action === 'nested split'
          ? [{ type: 'quote', id: 'quote', children: [paragraph] }]
          : [paragraph]
      Transforms.select(editor, {
        path: action === 'nested split' ? [0, 0, 0] : [0, 0],
        offset: 2,
      })
      const before = structuredClone(editor.children)
      const selection = structuredClone(editor.selection)
      let generated = 0
      editor.getSplitProperties = node => {
        const properties = Node.extractProps(node)
        if (!Element.isElement(node)) return properties
        const { id, ...rest } = properties
        return policy === 'omit'
          ? rest
          : { ...rest, id: `generated-${++generated}` }
      }
      HistoryEditor.withNewBatch(editor, () => {
        if (action === 'break') editor.insertBreak()
        else if (action === 'fragment')
          editor.insertFragment([
            { type: 'paragraph', children: [{ text: 'one' }] },
            { type: 'paragraph', children: [{ text: 'two' }] },
          ])
        else
          Transforms.splitNodes(editor, {
            match: node => Element.isElement(node),
            mode: 'highest',
          })
      })
      const after = structuredClone(editor.children)
      const ids = Array.from(Node.elements(editor), ([node]) => node.id).filter(
        id => id !== undefined
      )
      assert.strictEqual(new Set(ids).size, ids.length)
      assert.strictEqual(editor.history.undos.length, 1)
      const generationCount = generated
      editor.undo()
      assert.deepStrictEqual(editor.children, before)
      assert.deepStrictEqual(editor.selection, selection)
      editor.redo()
      assert.deepStrictEqual(editor.children, after)
      assert.strictEqual(generated, generationCount)
    })
  }
}
