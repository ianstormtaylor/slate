import assert from 'assert'
import { createEditor } from '../src'
import {
  insertChildren,
  modifyDescendant,
  replaceChild,
  replaceChildren,
} from '../src/utils/modify'

describe('modify utilities', () => {
  it('copy child arrays before insert, replace, and direct child assignment', () => {
    const original = ['a', 'b', 'c']

    const inserted = insertChildren(original, 1, 'x', 'y')
    const replaced = replaceChildren(original, 1, 1, 'z')
    const assigned = replaceChild(original, 2, 'q')

    assert.deepEqual(original, ['a', 'b', 'c'])
    assert.deepEqual(inserted, ['a', 'x', 'y', 'b', 'c'])
    assert.deepEqual(replaced, ['a', 'z', 'c'])
    assert.deepEqual(assigned, ['a', 'b', 'q'])
    assert.notStrictEqual(inserted, original)
    assert.notStrictEqual(replaced, original)
    assert.notStrictEqual(assigned, original)
  })

  it('rewrites only the ancestors needed for a descendant change', () => {
    const editor = createEditor()
    const first = { type: 'paragraph', children: [{ text: 'one' }] }
    const second = { type: 'paragraph', children: [{ text: 'two' }] }

    editor.children = [first, second]
    const previousChildren = editor.children

    modifyDescendant(editor, [0], node => ({ ...node, id: 'a' }))

    assert.notStrictEqual(editor.children, previousChildren)
    assert.notStrictEqual(editor.children[0], first)
    assert.strictEqual(editor.children[1], second)
    assert.deepEqual(editor.children[0], {
      type: 'paragraph',
      id: 'a',
      children: [{ text: 'one' }],
    })
  })

  it('does not rewrite ancestors for no-op descendant updates', () => {
    const editor = createEditor()

    editor.children = [
      { type: 'paragraph', children: [{ text: 'one' }] },
      { type: 'paragraph', children: [{ text: 'two' }] },
    ]

    const previousChildren = editor.children

    modifyDescendant(editor, [1], node => node)

    assert.strictEqual(editor.children, previousChildren)
  })
})
