import assert from 'assert'
import {
  createEditor,
  Descendant,
  Element,
  Node,
  Path,
  Text,
  Transforms,
} from 'slate'

const block = (text: string, id = 'original'): Element => ({
  type: 'paragraph',
  id,
  children: [{ text }],
})

const setup = (children: Descendant[], path: Path, offset: number) => {
  const editor = createEditor()
  editor.children = children
  Transforms.select(editor, { path, offset })
  return editor
}

const withoutId = (node: Element | Text) => {
  const { id, ...properties } = Node.extractProps(node)
  return properties
}

describe('split properties', () => {
  it('defaults to copying element and text properties without their contents', () => {
    const editor = createEditor()
    assert.deepStrictEqual(editor.getSplitProperties(block('hello'), [0]), {
      type: 'paragraph',
      id: 'original',
    })
    assert.deepStrictEqual(
      editor.getSplitProperties(
        { text: 'hello', bold: true, id: 'leaf' },
        [0, 0]
      ),
      { bold: true, id: 'leaf' }
    )
  })

  for (const offset of [2, 5]) {
    it(`can omit an element id when insertBreak splits at offset ${offset}`, () => {
      const editor = setup([block('hello')], [0, 0], offset)
      const paths: Path[] = []
      editor.getSplitProperties = (node, path) => {
        if (Element.isElement(node)) paths.push(path)
        return withoutId(node)
      }
      editor.insertBreak()
      assert.deepStrictEqual(editor.children, [
        block('hello'.slice(0, offset)),
        { type: 'paragraph', children: [{ text: 'hello'.slice(offset) }] },
      ])
      assert.deepStrictEqual(paths, [[0]])
      assert.deepStrictEqual(editor.selection?.anchor, {
        path: [1, 0],
        offset: 0,
      })
    })
  }

  it('keeps the quote id and omits only the new paragraph id on a nested break', () => {
    const editor = setup(
      [{ type: 'quote', id: 'quote', children: [block('hello')] }],
      [0, 0, 0],
      2
    )
    editor.getSplitProperties = withoutId
    editor.insertBreak()
    assert.deepStrictEqual(editor.children, [
      {
        type: 'quote',
        id: 'quote',
        children: [
          block('he'),
          { type: 'paragraph', children: [{ text: 'llo' }] },
        ],
      },
    ])
  })

  it('uses the node and path at every split level when splitting a quote', () => {
    const editor = setup(
      [{ type: 'quote', id: 'quote', children: [block('hello')] }],
      [0, 0, 0],
      2
    )
    const seen: { id: string | undefined; path: Path }[] = []
    editor.getSplitProperties = (node, path) => {
      if (Element.isElement(node)) seen.push({ id: node.id, path })
      return withoutId(node)
    }
    Transforms.splitNodes(editor, {
      match: node => Element.isElement(node),
      mode: 'highest',
    })
    assert.deepStrictEqual(editor.children, [
      { type: 'quote', id: 'quote', children: [block('he')] },
      {
        type: 'quote',
        children: [{ type: 'paragraph', children: [{ text: 'llo' }] }],
      },
    ])
    assert.deepStrictEqual(seen, [
      { id: 'original', path: [0, 0] },
      { id: 'quote', path: [0] },
    ])
  })

  it('allocates a fresh id for the trailing block when inserting a two-block fragment', () => {
    const editor = setup([block('hello')], [0, 0], 2)
    let counter = 0
    editor.getSplitProperties = node => {
      const properties = Node.extractProps(node)
      return Element.isElement(node)
        ? { ...properties, id: `split-${++counter}` }
        : properties
    }
    editor.insertFragment([
      block('one', 'pasted-first'),
      block('two', 'pasted-last'),
    ])
    assert.deepStrictEqual(editor.children, [
      block('heone'),
      block('twollo', 'split-1'),
    ])
    assert.strictEqual(counter, 1)
  })

  for (const override of [false, true]) {
    it(`preserves text marks through setNodes with split ${
      override ? 'with an override' : 'by default'
    }`, () => {
      const editor = setup(
        [
          {
            type: 'paragraph',
            id: 'original',
            children: [{ text: 'hello', bold: true }],
          },
        ],
        [0, 0],
        2
      )
      const paths: Path[] = []
      if (override) {
        editor.getSplitProperties = (node, path) => {
          paths.push(path)
          return Element.isElement(node)
            ? withoutId(node)
            : Node.extractProps(node)
        }
      }
      Transforms.setNodes(
        editor,
        { italic: true },
        {
          at: {
            anchor: { path: [0, 0], offset: 2 },
            focus: { path: [0, 0], offset: 4 },
          },
          match: Node.isText,
          split: true,
        }
      )
      assert.deepStrictEqual(editor.children, [
        {
          type: 'paragraph',
          id: 'original',
          children: [
            { text: 'he', bold: true },
            { text: 'll', bold: true, italic: true },
            { text: 'o', bold: true },
          ],
        },
      ])
      if (override)
        assert.deepStrictEqual(paths, [
          [0, 0],
          [0, 0],
        ])
    })
  }

  it('is used when wrapNodes splits an inline ancestor', () => {
    const editor = createEditor()
    editor.isInline = element =>
      element.type === 'link' || element.type === 'mark'
    editor.children = [
      {
        type: 'paragraph',
        children: [
          { text: 'A' },
          { type: 'link', id: 'link', children: [{ text: 'BCDE' }] },
          { text: 'FG' },
        ],
      },
    ]
    const seen: Path[] = []
    editor.getSplitProperties = (node, path) => {
      if (Element.isElement(node)) seen.push(path)
      return withoutId(node)
    }
    Transforms.wrapNodes(
      editor,
      { type: 'mark', children: [] },
      {
        at: {
          anchor: { path: [0, 1, 0], offset: 2 },
          focus: { path: [0, 2], offset: 1 },
        },
        split: true,
        match: Text.isText,
      }
    )
    const ids = Array.from(Node.elements(editor), ([node]) => node.id).filter(
      id => id !== undefined
    )
    assert.deepStrictEqual(ids, ['link'])
    assert.deepStrictEqual(seen, [[0, 1]])
  })
})
