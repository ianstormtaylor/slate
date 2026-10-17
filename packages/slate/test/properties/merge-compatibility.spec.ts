import assert from 'assert'
import { Editor, Element, Transforms } from 'slate'
import { create } from './generators'

for (const inline of [false, true]) {
  for (const reverse of [false, true]) {
    it(`rejects incompatible merge children with inline ${inline} and reverse ${reverse}`, () => {
      const blocks = { children: [{ children: [{ text: 'a' }] }] }
      const inlines: Element = {
        children: inline
          ? [{ inline: true, children: [{ text: 'b' }] }]
          : [{ text: 'b' }],
      }
      const editor = create(reverse ? [inlines, blocks] : [blocks, inlines])
      Transforms.select(editor, Editor.start(editor, [1]))
      const before = structuredClone({
        children: editor.children,
        selection: editor.selection,
      })
      const count = editor.operations.length
      assert.throws(
        () => Transforms.mergeNodes(editor, { at: [1], voids: true }),
        /path \[1\].*path \[0\].*children are not the same kind/
      )
      assert.deepStrictEqual(editor.children, before.children)
      assert.deepStrictEqual(editor.selection, before.selection)
      assert.strictEqual(editor.operations.length, count)
      assert.strictEqual(Editor.pathRefs(editor).size, 0)
    })
  }
}

it('rejects a non-sibling merge before moving nodes or retaining refs', () => {
  const editor = create([
    { type: 'target', children: [{ children: [{ text: 'a' }] }] },
    { children: [{ type: 'current', children: [{ text: 'b' }] }] },
  ])
  const before = structuredClone(editor.children)
  assert.throws(
    () =>
      Transforms.mergeNodes(editor, {
        at: [1, 0],
        match: node =>
          Element.isElement(node) &&
          (node.type === 'target' || node.type === 'current'),
      }),
    /path \[1,0\].*path \[0\].*children are not the same kind/
  )
  assert.deepStrictEqual(editor.children, before)
  assert.deepStrictEqual(editor.operations, [])
  assert.strictEqual(Editor.pathRefs(editor).size, 0)
})

it('keeps the previous-node removal policy for incompatible children', () => {
  const editor = create([
    { children: [{ children: [{ text: 'a' }] }] },
    { children: [{ text: 'b' }] },
  ])
  let calls = 0
  editor.shouldMergeNodesRemovePrevNode = () => {
    calls++
    return true
  }
  Transforms.mergeNodes(editor, { at: [1] })
  assert.deepStrictEqual(editor.children, [{ children: [{ text: 'b' }] }])
  assert.strictEqual(calls, 1)
  assert.strictEqual(
    editor.operations.some(op => op.type === 'merge_node'),
    false
  )
})

for (const emptyPrevious of [false, true]) {
  it(`allows an empty merge side with empty previous ${emptyPrevious}`, () => {
    const content = { children: [{ children: [{ text: 'a' }] }] }
    const empty = { children: [] }
    const editor = create(
      emptyPrevious ? [empty, content] : [content, empty],
      false
    )
    Transforms.mergeNodes(editor, { at: [1] })
    assert.strictEqual(Editor.string(editor, []), 'a')
    assert.strictEqual(editor.children.length, 1)
  })
}

it('keeps text-node merging unchanged', () => {
  const editor = create([
    { children: [{ text: 'a' }, { text: 'b', bold: true }] },
  ])
  Transforms.mergeNodes(editor, { at: [0, 1] })
  assert.deepStrictEqual(editor.children, [{ children: [{ text: 'ab' }] }])
})

it('keeps compatible block-child merging unchanged', () => {
  const editor = create([
    { children: [{ children: [{ text: 'a' }] }] },
    { children: [{ children: [{ text: 'b' }] }] },
  ])
  Transforms.mergeNodes(editor, { at: [1] })
  assert.deepStrictEqual(editor.children, [
    {
      children: [{ children: [{ text: 'a' }] }, { children: [{ text: 'b' }] }],
    },
  ])
})

it('rejects an inline merge into a container with an empty paragraph', () => {
  const editor = create([
    { children: [{ text: 'a' }] },
    { children: [{ children: [{ text: '' }] }] },
    { children: [{ inline: true, children: [{ text: 'b' }] }] },
  ])
  const before = structuredClone(editor.children)
  assert.throws(
    () => Transforms.mergeNodes(editor, { at: [2], voids: true }),
    /path \[2\].*path \[1\].*children are not the same kind/
  )
  assert.deepStrictEqual(editor.children, before)
  assert.deepStrictEqual(editor.operations, [])
})
