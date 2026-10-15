import assert from 'assert'
import { createEditor, Editor, Element, Node, Point, Transforms } from 'slate'
import { createHyperscript } from 'slate-hyperscript'

const jsx = createHyperscript({
  elements: { block: {}, inline: { inline: true } },
})
const fixture = (inline: boolean) => {
  const editor = createEditor()
  editor.isInline = element => element.inline === true
  editor.isVoid = element => element.void === true
  editor.children = [
    jsx(
      'block',
      {},
      ...(inline
        ? [
            jsx('text', {}, 'left'),
            jsx('inline', {}, 'link'),
            jsx('text', {}, 'right'),
          ]
        : [jsx('text', { a: true }, 'bold'), jsx('text', {}, 'plain')])
    ),
  ]
  return editor
}
const insertions = {
  text: (editor: Editor, at?: Point) => editor.insertText('X', { at }),
  fragment: (editor: Editor, at?: Point) =>
    editor.insertFragment([{ children: [{ text: 'X' }] }], { at }),
  inline: (editor: Editor, at?: Point) =>
    Transforms.insertNodes(
      editor,
      { inline: true, children: [{ text: 'X' }] },
      { at }
    ),
}

for (const [name, insert] of Object.entries(insertions)) {
  describe(`${name} edge affinity`, () => {
    for (const affinity of ['inside', 'outside', null] as const) {
      for (const edge of ['start', 'end'] as const) {
        for (const representation of ['inside', 'outside'] as const) {
          it(`${affinity} inline ${edge} from ${representation}`, () => {
            const editor = fixture(true)
            const inside = { path: [0, 1, 0], offset: edge === 'start' ? 0 : 4 }
            const outside = {
              path: [0, edge === 'start' ? 0 : 2],
              offset: edge === 'start' ? 4 : 0,
            }
            const at = representation === 'inside' ? inside : outside
            editor.inlineEdgeAffinity = () => affinity
            Transforms.select(editor, at)
            const expected =
              affinity === 'inside'
                ? inside
                : affinity === 'outside'
                ? outside
                : at
            assert.deepStrictEqual(Editor.insertionPoint(editor, at), expected)
            insert(editor)
            const [link] = Array.from(Node.elements(editor)).find(
              ([node]) =>
                editor.isInline(node) && Node.string(node).includes('link')
            )!
            const staysInside =
              affinity === 'inside' ||
              (affinity === null &&
                representation === 'inside' &&
                name !== 'fragment')
            assert.strictEqual(Node.string(link).includes('X'), staysInside)
          })
        }
      }
    }
    for (const affinity of ['backward', 'forward', null] as const) {
      for (const side of ['before', 'after'] as const) {
        it(`${affinity} leaf from ${side}`, () => {
          const editor = fixture(false)
          const at = {
            path: [0, side === 'before' ? 0 : 1],
            offset: side === 'before' ? 4 : 0,
          }
          editor.leafEdgeAffinity = () => affinity
          Transforms.select(editor, at)
          const expected =
            affinity === 'backward'
              ? { path: [0, 0], offset: 4 }
              : affinity === 'forward'
              ? { path: [0, 1], offset: 0 }
              : at
          assert.deepStrictEqual(Editor.insertionPoint(editor, at), expected)
          if (name === 'text' && affinity !== null) {
            const marks = Editor.marks(editor)
            insert(editor)
            const [receiving] = Array.from(Node.texts(editor)).find(([text]) =>
              text.text.includes('X')
            )!
            assert.deepStrictEqual(Node.extractProps(receiving), marks)
          } else {
            insert(editor)
            assert.strictEqual(Node.string(editor), 'boldXplain')
          }
        })
      }
    }
    it('ignores explicit locations', () => {
      const editor = fixture(true)
      editor.inlineEdgeAffinity = () => {
        throw new Error('unexpected hook')
      }
      editor.leafEdgeAffinity = () => {
        throw new Error('unexpected hook')
      }
      const at = { path: [0, 1, 0], offset: 4 }
      Transforms.select(editor, at)
      insert(editor, at)
    })
    it('ignores expanded selections', () => {
      const editor = fixture(false)
      editor.inlineEdgeAffinity = () => {
        throw new Error('unexpected hook')
      }
      editor.leafEdgeAffinity = () => {
        throw new Error('unexpected hook')
      }
      Transforms.select(editor, {
        anchor: { path: [0, 0], offset: 1 },
        focus: { path: [0, 1], offset: 2 },
      })
      insert(editor)
      assert.strictEqual(Node.string(editor), 'bXain')
    })
  })
}

for (const [name, insert] of Object.entries(insertions)) {
  for (const markable of [false, true]) {
    for (const value of ['inside', 'outside', null] as const) {
      it(`${name} respects ${
        markable ? 'markable' : 'unmarkable'
      } void neighbors with ${value}`, () => {
        for (const at of [
          { path: [0, 0], offset: 4 },
          { path: [0, 2], offset: 0 },
        ]) {
          const editor = fixture(true)
          const element = Node.get(editor, [0, 1]) as Element
          element.void = true
          editor.markableVoid = () => markable
          editor.inlineEdgeAffinity = () => value
          assert.deepStrictEqual(Editor.insertionPoint(editor, at), at)
          Transforms.select(editor, at)
          insert(editor)
          const [original] = Array.from(Node.elements(editor)).find(
            ([node]) => node.void === true
          )!
          assert.strictEqual(Node.string(original), 'link')
        }
      })
    }
  }
}

it('keeps explicit marks when canonicalizing a caret', () => {
  const editor = fixture(false)
  editor.leafEdgeAffinity = () => 'backward'
  Transforms.select(editor, { path: [0, 1], offset: 0 })
  editor.marks = { b: true }
  editor.insertText('X')
  assert.deepStrictEqual(
    Array.from(Node.texts(editor)).find(([text]) => text.text === 'X')![0],
    { text: 'X', b: true }
  )
})

it('applies leaf affinity inside an inline away from its edges', () => {
  const editor = fixture(true)
  const inline = Node.get(editor, [0, 1]) as Element
  inline.children = [{ text: 'a', a: true }, { text: 'b' }]
  editor.leafEdgeAffinity = () => 'backward'
  assert.deepStrictEqual(
    Editor.insertionPoint(editor, { path: [0, 1, 1], offset: 0 }),
    { path: [0, 1, 0], offset: 1 }
  )
})

it('leaves text-node and block-node insertion unchanged', () => {
  for (const node of [{ text: 'X' }, { children: [{ text: 'X' }] }]) {
    const editor = fixture(true)
    editor.inlineEdgeAffinity = () => {
      throw new Error('unexpected hook')
    }
    editor.leafEdgeAffinity = () => {
      throw new Error('unexpected hook')
    }
    Transforms.select(editor, { path: [0, 1, 0], offset: 4 })
    Transforms.insertNodes(editor, node)
  }
})

it('reports the receiving marks on both sides of an inline edge', () => {
  for (const value of ['inside', 'outside'] as const) {
    for (const at of [
      { path: [0, 1, 0], offset: 4 },
      { path: [0, 2], offset: 0 },
    ]) {
      const editor = fixture(true)
      const inline = Node.get(editor, [0, 1]) as Element
      inline.children = [{ text: 'link', a: true }]
      editor.inlineEdgeAffinity = () => value
      Transforms.select(editor, at)
      assert.deepStrictEqual(
        Editor.marks(editor),
        value === 'inside' ? { a: true } : {}
      )
      editor.insertText('X')
      const [text] = Array.from(Node.texts(editor)).find(([node]) =>
        node.text.includes('X')
      )!
      assert.deepStrictEqual(
        Node.extractProps(text),
        value === 'inside' ? { a: true } : {}
      )
    }
  }
})

it('keeps empty inline boundaries stable', () => {
  const editor = fixture(true)
  editor.children = [
    jsx(
      'block',
      {},
      jsx('text', {}, ''),
      jsx('inline', {}, jsx('text', {}, '')),
      jsx('text', {}, ''),
      jsx('inline', {}, jsx('text', {}, '')),
      jsx('text', {}, '')
    ),
  ]
  for (const value of ['inside', 'outside'] as const) {
    editor.inlineEdgeAffinity = () => value
    for (const [, path] of Node.texts(editor)) {
      const once = Editor.insertionPoint(editor, { path, offset: 0 })
      assert.deepStrictEqual(Editor.insertionPoint(editor, once), once)
    }
  }
})

it('applies inline affinity to a nested edge within its parent', () => {
  const editor = fixture(true)
  const inline = Node.get(editor, [0, 1]) as Element
  inline.children = [
    { text: 'a' },
    { inline: true, children: [{ text: 'nested' }] },
    { text: 'z' },
  ]
  editor.inlineEdgeAffinity = () => 'outside'
  assert.deepStrictEqual(
    Editor.insertionPoint(editor, { path: [0, 1, 1, 0], offset: 6 }),
    { path: [0, 1, 2], offset: 0 }
  )
})

for (const offset of [0, 4]) {
  it(`keeps both ends of a multi-block fragment inside an inline at ${offset}`, () => {
    const editor = fixture(true)
    editor.inlineEdgeAffinity = () => 'inside'
    Transforms.select(editor, { path: [0, 1, 0], offset })
    editor.insertFragment([
      { children: [{ text: 'X' }] },
      { children: [{ text: 'Y' }] },
    ])
    assert.strictEqual(
      Node.string(editor),
      offset ? 'leftlinkXYright' : 'leftXYlinkright'
    )
    const inlines = Array.from(Node.elements(editor)).filter(([node]) =>
      editor.isInline(node)
    )
    assert.strictEqual(inlines.length, 2)
    assert(Node.string(inlines[0][0]).includes('X'))
    assert(Node.string(inlines[1][0]).includes('Y'))
    assert(editor.selection)
    assert(Node.has(editor, editor.selection.anchor.path))
  })
}
