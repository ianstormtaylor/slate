import assert from 'assert'
import { createEditor, Editor, Element, Transforms } from 'slate'

const block = (text: string) => ({ children: [{ text }] })
const nested = () => ({ children: [{ children: [block('target')] }] })

describe('liftNodes height', () => {
  it('lifts through two ancestors and preserves selection', () => {
    const editor = createEditor()
    editor.children = [nested()]
    Transforms.select(editor, { path: [0, 0, 0, 0], offset: 3 })
    Transforms.liftNodes(editor, { height: 2 })
    assert.deepStrictEqual(editor.children, [block('target')])
    assert.deepStrictEqual(editor.selection, {
      anchor: { path: [0, 0], offset: 3 },
      focus: { path: [0, 0], offset: 3 },
    })
    assert.strictEqual(Editor.pathRefs(editor).size, 0)
  })

  it('splits both ancestors around a middle child', () => {
    const editor = createEditor()
    editor.children = [
      {
        children: [
          block('outer before'),
          {
            children: [
              block('inner before'),
              block('target'),
              block('inner after'),
            ],
          },
          block('outer after'),
        ],
      },
    ]
    Transforms.liftNodes(editor, { at: [0, 1, 1], height: 2 })
    assert.deepStrictEqual(editor.children, [
      {
        children: [
          block('outer before'),
          { children: [block('inner before')] },
        ],
      },
      block('target'),
      {
        children: [{ children: [block('inner after')] }, block('outer after')],
      },
    ])
  })

  it('tracks multiple matched siblings as their ancestors change', () => {
    const editor = createEditor()
    editor.children = [
      { children: [{ children: [block('one'), block('two')] }] },
    ]
    Transforms.liftNodes(editor, {
      at: [],
      match: n => Element.isElement(n) && Editor.hasTexts(editor, n),
      height: 2,
    })
    assert.deepStrictEqual(editor.children, [block('one'), block('two')])
    assert.strictEqual(Editor.pathRefs(editor).size, 0)
  })

  it('does nothing for height zero', () => {
    const editor = createEditor()
    editor.children = [nested()]
    Transforms.liftNodes(editor, { at: [0, 0, 0], height: 0 })
    assert.deepStrictEqual(editor.children, [nested()])
    assert.strictEqual(editor.operations.length, 0)
  })

  it('stops at the top level when height exceeds the available ancestors', () => {
    const editor = createEditor()
    editor.children = [nested()]
    Transforms.liftNodes(editor, { at: [0, 0, 0], height: 10 })
    assert.deepStrictEqual(editor.children, [block('target')])
  })

  it('respects void boundaries unless voids is enabled', () => {
    const editor = createEditor()
    editor.isVoid = node => node.type === 'void'
    const initial = [
      { children: [{ type: 'void', children: [block('target')] }] },
    ]
    editor.children = initial
    Transforms.liftNodes(editor, { at: [0, 0, 0], height: 2 })
    assert.deepStrictEqual(editor.children, initial)
    Transforms.liftNodes(editor, { at: [0, 0, 0], height: 2, voids: true })
    assert.deepStrictEqual(editor.children, [block('target')])
  })

  it('tracks overlapping matches in all mode', () => {
    const editor = createEditor()
    editor.children = [
      {
        children: [
          {
            type: 'lift',
            children: [{ type: 'lift', children: [{ text: 'target' }] }],
          },
        ],
      },
    ]
    Transforms.liftNodes(editor, {
      at: [],
      match: n => Element.isElement(n) && n.type === 'lift',
      mode: 'all',
      height: 2,
    })
    assert.deepStrictEqual(editor.children, [
      { type: 'lift', children: [{ text: 'target' }] },
    ])
    assert.strictEqual(Editor.pathRefs(editor).size, 0)
  })

  it('releases references if a top-level match cannot be lifted', () => {
    const editor = createEditor()
    editor.children = [block('one'), block('two')]
    assert.throws(
      () => Transforms.liftNodes(editor, { at: [], height: 2 }),
      /depth of less than/
    )
    assert.strictEqual(Editor.pathRefs(editor).size, 0)
  })

  it('keeps the default one-level behavior', () => {
    const editor = createEditor()
    editor.children = [nested()]
    Transforms.liftNodes(editor, { at: [0, 0, 0] })
    assert.deepStrictEqual(editor.children, [{ children: [block('target')] }])
  })

  it('rejects invalid heights before changing the document', () => {
    for (const height of [-1, 0.5, Infinity, NaN]) {
      const editor = createEditor()
      editor.children = [nested()]
      assert.throws(
        () => Transforms.liftNodes(editor, { at: [0, 0, 0], height }),
        /non-negative integer/
      )
      assert.deepStrictEqual(editor.children, [nested()])
      assert.strictEqual(Editor.pathRefs(editor).size, 0)
    }
  })
})
