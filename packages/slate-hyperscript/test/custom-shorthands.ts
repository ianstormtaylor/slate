import assert from 'assert'
import { createHyperscript } from 'slate-hyperscript'

describe('createHyperscript with element shorthands', () => {
  it('accepts the custom tags it was created with', () => {
    const h = createHyperscript({
      elements: {
        p: { type: 'paragraph' },
        item: { type: 'item' },
      },
    })

    const editor = h('editor', {}, h('item', {}, h('p', {}, 'p1')))

    assert.deepStrictEqual(editor.children, [
      {
        type: 'item',
        children: [{ type: 'paragraph', children: [{ text: 'p1' }] }],
      },
    ])
  })

  it('accepts the custom creators it was created with', () => {
    const h = createHyperscript({
      creators: {
        mention: (tagName, attributes) => ({
          type: 'mention',
          name: attributes.name,
          children: [{ text: '' }],
        }),
      },
    })

    assert.deepStrictEqual(h('mention', { name: 'Ada' }), {
      type: 'mention',
      name: 'Ada',
      children: [{ text: '' }],
    })
  })
})
