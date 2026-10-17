import assert from 'assert'
import {
  createEditor,
  Descendant,
  Editor,
  Element,
  Node,
  Operation,
  Path,
  Point,
  Transforms,
} from 'slate'
import { HistoryEditor, withHistory } from 'slate-history'

const block = (text: string): Element => ({
  type: 'paragraph',
  children: [{ text }],
})
const setup = (children: Descendant[], point?: Point) => {
  const editor = createEditor()
  editor.isInline = element => element.inline === true
  editor.isVoid = element => element.void === true
  editor.children = children
  if (point) Transforms.select(editor, point)
  editor.operations = []
  return editor
}

describe('setChildren', () => {
  it('uses the overridable instance transform', () => {
    const editor = setup([block('a')])
    const next = [block('b')]
    let received: Descendant[] | undefined
    editor.setChildren = children => {
      received = children
    }
    Transforms.setChildren(editor, next)
    assert.strictEqual(received, next)
  })

  it('appends text without replacing its node', () => {
    const editor = setup([block('word')], { path: [0, 0], offset: 2 })
    Transforms.setChildren(editor, [block('words')])
    assert.deepStrictEqual(editor.operations, [
      { type: 'insert_text', path: [0, 0], offset: 4, text: 's' },
    ])
    assert.deepStrictEqual(editor.selection?.anchor, {
      path: [0, 0],
      offset: 2,
    })
  })

  it('replaces only the changed string middle', () => {
    const editor = setup([block('abcXYZdef')])
    Transforms.setChildren(editor, [block('abcQdef')])
    assert.deepStrictEqual(
      editor.operations.map(op => op.type),
      ['remove_text', 'insert_text']
    )
    assert.deepStrictEqual(editor.operations[0], {
      type: 'remove_text',
      path: [0, 0],
      offset: 3,
      text: 'XYZ',
    })
    assert.deepStrictEqual(editor.children, [block('abcQdef')])
  })

  it('streams into the last block and preserves other identities', () => {
    const first = block('typing')
    const editor = setup([first, block('stream')], { path: [0, 0], offset: 3 })
    Transforms.setChildren(editor, [first, block('streaming')])
    assert.strictEqual(editor.children[0], first)
    assert.strictEqual(editor.operations.length, 1)
    assert.deepStrictEqual(editor.selection?.anchor, {
      path: [0, 0],
      offset: 3,
    })
  })

  it('changes element and text properties with set_node', () => {
    const editor = setup([block('a')])
    const next: Descendant[] = [
      { type: 'quote', children: [{ text: 'a', bold: true }] },
    ]
    Transforms.setChildren(editor, next)
    assert.deepStrictEqual(editor.children, next)
    assert.deepStrictEqual(
      editor.operations.map(op => op.type),
      ['set_node', 'set_node']
    )
  })

  for (const kind of ['insert', 'remove'] as const) {
    it(`${kind}s a block before the selected block without changing its text`, () => {
      const selected = block('selected')
      const before = block('before')
      const editor = setup(
        kind === 'insert' ? [selected] : [before, selected],
        { path: [kind === 'insert' ? 0 : 1, 0], offset: 3 }
      )
      Transforms.setChildren(
        editor,
        kind === 'insert' ? [before, selected] : [selected]
      )
      assert.deepStrictEqual(editor.selection?.anchor, {
        path: [kind === 'insert' ? 1 : 0, 0],
        offset: 3,
      })
      assert.strictEqual(
        Node.leaf(editor, editor.selection!.anchor.path).text,
        'selected'
      )
      assert.strictEqual(editor.operations.length, 1)
    })
  }

  it('falls back to a valid point after deleting the selected block', () => {
    const remaining = block('remaining')
    const editor = setup([block('deleted'), remaining], {
      path: [0, 0],
      offset: 4,
    })
    Transforms.setChildren(editor, [remaining])
    assert.deepStrictEqual(editor.children, [remaining])
    assert.deepStrictEqual(editor.selection?.anchor, {
      path: [0, 0],
      offset: 0,
    })
  })

  it('emits zero operations for the same array or a deep-equal clone', () => {
    const editor = setup([block('same')])
    Transforms.setChildren(editor, editor.children)
    Transforms.setChildren(editor, structuredClone(editor.children))
    assert.deepStrictEqual(editor.operations, [])
    assert.strictEqual(Editor.pathRefs(editor).size, 0)
  })

  it('edits inline and void children and normalizes the result', () => {
    const editor = setup([block('before')])
    const next: Descendant[] = [
      {
        children: [
          { text: '' },
          { inline: true, children: [{ text: 'link' }] },
          { text: '' },
          { inline: true, void: true, children: [{ text: '' }] },
          { text: '' },
        ],
      },
    ]
    Transforms.setChildren(editor, next)
    assert.deepStrictEqual(editor.children, next)
    assert.strictEqual(Editor.pathRefs(editor).size, 0)
  })

  it('normalizes invalid external structure once editing finishes', () => {
    const editor = setup([block('before')])
    Transforms.setChildren(editor, [{ children: [] }])
    assert.deepStrictEqual(editor.children, [{ children: [{ text: '' }] }])
  })

  it('moves a shared block once and carries its selection', () => {
    const a = block('a')
    const b = block('b')
    const editor = setup([a, b], { path: [1, 0], offset: 1 })
    Transforms.setChildren(editor, [b, a])
    assert.deepStrictEqual(editor.children, [b, a])
    assert.deepStrictEqual(
      editor.operations.map(op => op.type),
      ['move_node']
    )
    assert.deepStrictEqual(editor.selection?.anchor, {
      path: [0, 0],
      offset: 1,
    })
  })

  it('moves a shared block across parents once', () => {
    const a = block('a')
    const b = block('b')
    const c = block('c')
    const editor = setup([{ children: [a, b] }, { children: [c] }], {
      path: [0, 1, 0],
      offset: 1,
    })
    const next = [{ children: [a] }, { children: [c, b] }]
    Transforms.setChildren(editor, next)
    assert.deepStrictEqual(editor.children, next)
    assert.deepStrictEqual(
      editor.operations.map(op => op.type),
      ['move_node']
    )
    assert.deepStrictEqual(editor.selection?.anchor, {
      path: [1, 1, 0],
      offset: 1,
    })
  })

  it('rescues a shared descendant before removing its old parent', () => {
    const shared = block('selected')
    const editor = setup([{ children: [shared] }, block('other')], {
      path: [0, 0, 0],
      offset: 2,
    })
    const next = [block('other'), { children: [shared] }]
    Transforms.setChildren(editor, next)
    assert.deepStrictEqual(editor.children, next)
    assert.deepStrictEqual(editor.selection?.anchor, {
      path: [1, 0, 0],
      offset: 2,
    })
    assert.strictEqual(
      editor.operations.filter(op => op.type === 'move_node').length,
      1
    )
  })

  it('moves a selected node into a newly introduced wrapper', () => {
    const shared = block('selected')
    const editor = setup([shared], { path: [0, 0], offset: 2 })
    Transforms.setChildren(editor, [{ children: [shared] }])
    assert.deepStrictEqual(editor.selection?.anchor, {
      path: [0, 0, 0],
      offset: 2,
    })
    assert.deepStrictEqual(
      editor.operations.map(op => op.type),
      ['insert_node', 'move_node']
    )
  })

  it('separates an external undo step from typing before and after it', () => {
    const editor = withHistory(setup([block('a')], { path: [0, 0], offset: 1 }))
    editor.insertText('b')
    Transforms.setChildren(editor, [block('abc')])
    editor.insertText('d')
    assert.strictEqual(editor.history.undos.length, 3)
    editor.undo()
    assert.strictEqual(Node.string(editor), 'abc')
    editor.undo()
    assert.strictEqual(Node.string(editor), 'ab')
    editor.undo()
    assert.strictEqual(Node.string(editor), 'a')
    for (let i = 0; i < 3; i++) editor.redo()
    assert.strictEqual(Node.string(editor), 'abcd')
  })

  it('honors withoutSaving for updates to a separate streamed block', () => {
    const editor = withHistory(
      setup([block('a'), block('stream')], { path: [0, 0], offset: 1 })
    )
    editor.insertText('b')
    HistoryEditor.withoutSaving(editor, () =>
      Transforms.setChildren(editor, [editor.children[0], block('streamed')])
    )
    editor.undo()
    assert.strictEqual(Node.string(editor), 'astreamed')
  })

  for (const [where, at] of [
    ['start', 0],
    ['middle', 2],
    ['end', 3],
  ] as const) {
    it(`matches unchanged blocks in fresh JSON with a block added at the ${where}`, () => {
      const editor = withHistory(
        setup([block('one'), block('two'), block('three')], {
          path: [2, 0],
          offset: 2,
        })
      )
      const next = JSON.parse(JSON.stringify(editor.children))
      next.splice(at, 0, block('new'))
      Transforms.setChildren(editor, next)
      assert.deepStrictEqual(
        editor.operations.map(op => op.type),
        ['insert_node']
      )
      const caretBlock = editor.selection!.anchor.path[0]
      assert.strictEqual(Node.string(editor.children[caretBlock]), 'three')
      assert.strictEqual(editor.selection!.anchor.offset, 2)
      editor.undo()
      assert.deepStrictEqual(
        editor.children.map(node => Node.string(node)),
        ['one', 'two', 'three']
      )
      assert.strictEqual(
        Node.string(editor.children[editor.selection!.anchor.path[0]]),
        'three'
      )
    })
  }
})

it('replaces nodes when differing properties cannot be changed by set_node', () => {
  const before = { children: [{ text: 'a' }], constructor: 'old' }
  const after = { children: [{ text: 'a' }], constructor: 'new' }
  const editor = setup([before])
  Transforms.setChildren(editor, [after])
  assert.deepStrictEqual(editor.children, [after])
  assert.deepStrictEqual(
    editor.operations.map(op => op.type),
    ['remove_node', 'insert_node']
  )
})

it('preserves custom dirty paths and normalization order across batched moves', () => {
  const first = block('first')
  const second = block('second')
  const third = block('third')
  const initial = [
    { type: 'container', children: [first, second] },
    { type: 'container', children: [third] },
    block('last'),
  ]
  const next = [
    { type: 'container', children: [third, block('changed')] },
    { type: 'container', children: [second, first] },
  ]
  const create = () => {
    const editor = setup(initial)
    const visited: Path[] = []
    const dirtied: Operation[] = []
    const { getDirtyPaths, normalizeNode } = editor
    editor.getDirtyPaths = op => {
      dirtied.push(op)
      return [...getDirtyPaths(op), [0]]
    }
    editor.normalizeNode = entry => {
      visited.push(entry[1])
      if (Element.isElement(entry[0]) && entry[0].type === 'paragraph') {
        Transforms.setNodes(editor, { type: 'normalized' }, { at: entry[1] })
      }
      normalizeNode(entry)
    }
    return { editor, visited, dirtied }
  }
  const actual = create()
  let operations: Operation[] = []
  Editor.withoutNormalizing(actual.editor, () => {
    Transforms.setNodes(actual.editor, { type: 'pending' }, { at: [2] })
    Transforms.setChildren(actual.editor, next)
    operations = [...actual.editor.operations]
  })
  const reference = create()
  Editor.withoutNormalizing(reference.editor, () => {
    for (const op of operations) reference.editor.apply(op)
  })
  assert.deepStrictEqual(actual.editor.children, reference.editor.children)
  assert.deepStrictEqual(actual.visited, reference.visited)
  assert.deepStrictEqual(actual.dirtied, reference.dirtied)
})
