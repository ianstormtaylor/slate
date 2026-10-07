import assert from 'assert'
import { createEditor, Editor, Transforms } from 'slate'

describe('location ref lifecycle', () => {
  it('tracks and releases path refs', () => {
    const editor = createEditor()
    editor.children = [{ children: [{ text: 'text' }] }]
    const released = Editor.pathRef(editor, [0, 0])
    const tracked = Editor.pathRef(editor, [0, 0])
    const refs = Editor.pathRefs(editor)
    assert.strictEqual(refs.size, 2)
    assert(refs.has(released))
    assert(refs.has(tracked))

    Transforms.insertNodes(
      editor,
      { children: [{ text: 'before' }] },
      { at: [0] }
    )
    assert.deepStrictEqual(released.current, [1, 0])
    assert.deepStrictEqual(tracked.current, [1, 0])
    assert.deepStrictEqual(released.unref(), [1, 0])
    assert.strictEqual(released.current, null)
    assert(!refs.has(released))
    assert(refs.has(tracked))
    assert.strictEqual(released.unref(), null)
    assert.strictEqual(refs.size, 1)

    Transforms.removeNodes(editor, { at: [1] })
    assert.strictEqual(released.current, null)
    assert.strictEqual(tracked.current, null)
    assert.strictEqual(refs.size, 0)
    assert.strictEqual(tracked.unref(), null)
  })

  it('tracks and releases point refs', () => {
    const editor = createEditor()
    editor.children = [{ children: [{ text: 'text' }] }]
    const released = Editor.pointRef(editor, { path: [0, 0], offset: 1 })
    const tracked = Editor.pointRef(editor, { path: [0, 0], offset: 1 })
    const refs = Editor.pointRefs(editor)
    assert.strictEqual(refs.size, 2)
    assert(refs.has(released))
    assert(refs.has(tracked))

    Transforms.insertNodes(
      editor,
      { children: [{ text: 'before' }] },
      { at: [0] }
    )
    assert.deepStrictEqual(released.unref(), { path: [1, 0], offset: 1 })
    assert.strictEqual(released.current, null)
    assert(!refs.has(released))
    assert(refs.has(tracked))
    assert.strictEqual(released.unref(), null)
    assert.strictEqual(refs.size, 1)

    Transforms.insertText(editor, 'x', { at: { path: [1, 0], offset: 0 } })
    assert.strictEqual(released.current, null)
    assert.deepStrictEqual(tracked.current, { path: [1, 0], offset: 2 })
    Transforms.removeNodes(editor, { at: [1] })
    assert.strictEqual(tracked.current, null)
    assert.strictEqual(refs.size, 0)
    assert.strictEqual(tracked.unref(), null)
  })

  it('tracks and releases range refs', () => {
    const editor = createEditor()
    editor.children = [{ children: [{ text: 'text' }] }]
    const range = {
      anchor: { path: [0, 0], offset: 1 },
      focus: { path: [0, 0], offset: 3 },
    }
    const released = Editor.rangeRef(editor, range)
    const tracked = Editor.rangeRef(editor, range)
    const refs = Editor.rangeRefs(editor)
    assert.strictEqual(refs.size, 2)
    assert(refs.has(released))
    assert(refs.has(tracked))

    Transforms.insertNodes(
      editor,
      { children: [{ text: 'before' }] },
      { at: [0] }
    )
    assert.deepStrictEqual(released.unref(), {
      anchor: { path: [1, 0], offset: 1 },
      focus: { path: [1, 0], offset: 3 },
    })
    assert.strictEqual(released.current, null)
    assert(!refs.has(released))
    assert(refs.has(tracked))
    assert.strictEqual(released.unref(), null)
    assert.strictEqual(refs.size, 1)

    Transforms.insertText(editor, 'x', { at: { path: [1, 0], offset: 0 } })
    assert.strictEqual(released.current, null)
    assert.deepStrictEqual(tracked.current, {
      anchor: { path: [1, 0], offset: 2 },
      focus: { path: [1, 0], offset: 4 },
    })
    Transforms.removeNodes(editor, { at: [1] })
    assert.strictEqual(tracked.current, null)
    assert.strictEqual(refs.size, 0)
    assert.strictEqual(tracked.unref(), null)
  })
})
