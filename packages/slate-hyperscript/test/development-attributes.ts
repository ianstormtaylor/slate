import assert from 'assert'
import { createHyperscript } from 'slate-hyperscript'

const self: { self?: unknown } = {}
self.self = self
const attributes = Object.freeze({
  __self: self,
  __source: { fileName: '/local/source/document.tsx', lineNumber: 1 },
  __custom: 'preserved',
})

describe('createHyperscript with development attributes', () => {
  it('creates serializable documents without Babel metadata', () => {
    const h = createHyperscript({ elements: { p: { type: 'paragraph' } } })
    const editor = h(
      'editor',
      attributes,
      h('p', attributes, h('text', { ...attributes, bold: true }, 'word'))
    )

    assert.doesNotThrow(() => JSON.stringify(editor))
    assert.equal('__self' in editor, false)
    assert.equal('__source' in editor, false)
    assert.deepStrictEqual(editor.children, [
      {
        type: 'paragraph',
        __custom: 'preserved',
        children: [{ text: 'word', bold: true, __custom: 'preserved' }],
      },
    ])
    assert.strictEqual(attributes.__self, self)
    assert.equal(attributes.__source.fileName, '/local/source/document.tsx')
  })

  it('removes Babel metadata before calling custom creators', () => {
    const h = createHyperscript({
      creators: {
        custom: (tagName, props, children) => ({ tagName, props, children }),
      },
    })

    assert.deepStrictEqual(h('custom', attributes, 'word'), {
      tagName: 'custom',
      props: { __custom: 'preserved' },
      children: ['word'],
    })
  })

  it('removes Babel metadata before calling function tags', () => {
    const h = createHyperscript()
    const component = (props: Record<string, unknown>) => props

    assert.deepStrictEqual(h(component, attributes, 'word'), {
      __custom: 'preserved',
      children: ['word'],
    })
  })
})
