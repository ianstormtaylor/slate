import assert from 'assert'
import { createEditor, Editor, Transforms } from 'slate'

const flushMicrotasks = async () => {
  await Promise.resolve()
}

describe('createEditor children accessor', () => {
  it('defines children as an enumerable accessor with normal editor semantics', () => {
    const editor = createEditor()
    const descriptor = Object.getOwnPropertyDescriptor(editor, 'children')
    const value = [{ type: 'paragraph', children: [{ text: 'one' }] }]

    assert.equal(typeof descriptor?.get, 'function')
    assert.equal(typeof descriptor?.set, 'function')
    assert.equal(descriptor?.enumerable, true)

    editor.children = value

    assert.equal(editor.children, value)
    assert(Object.keys(editor).includes('children'))
    assert(Editor.isEditor(editor, { deep: true }))
  })

  it('preserves pending operations across internal children rewrites', async () => {
    const editor = createEditor()

    editor.children = [
      { type: 'paragraph', children: [{ text: 'one' }] },
      { type: 'paragraph', children: [{ text: 'two' }] },
    ]

    Transforms.select(editor, {
      anchor: { path: [1, 0], offset: 1 },
      focus: { path: [1, 0], offset: 1 },
    })
    Transforms.mergeNodes(editor, { at: [1] })

    assert.equal(editor.operations[0]?.type, 'set_selection')
    assert(editor.operations.slice(1).some(op => op.type === 'merge_node'))

    await flushMicrotasks()

    assert.deepEqual(editor.operations, [])
  })

  it('routes children access through overrideable editor methods', () => {
    const editor = createEditor()
    const value = [{ type: 'paragraph', children: [{ text: 'one' }] }]
    const calls = []
    const getChildren = editor.getChildren
    const setChildren = editor.setChildren

    editor.getChildren = () => {
      calls.push('get')
      return getChildren()
    }

    editor.setChildren = children => {
      calls.push('set')
      setChildren(children)
    }

    editor.children = value

    assert.equal(editor.children, value)
    assert.deepEqual(calls, ['set', 'get'])
  })
})
