import { Element } from 'slate'
import { createHyperscript } from 'slate-hyperscript'

const h = createHyperscript({
  elements: {
    block: { type: 'block' },
    inline: { type: 'inline' },
    void_block: { type: 'void_block' },
    void_inline: { type: 'void_inline' },
  },
  annotations: {
    atomic_annotation: { type: 'atomic_annotation' },
  },
})

const TestPlugin = Editor => {
  return class extends Editor {
    isBlock(node) {
      return Element.isElement(node) && node.type.endsWith('block')
    }

    isInline(node) {
      return Element.isElement(node) && node.type.endsWith('inline')
    }

    isVoid(node) {
      return Element.isElement(node) && node.type.startsWith('void_')
    }

    isAtomic(mark) {
      return mark.type.startsWith('atomic_')
    }
  }
}

export { h, TestPlugin }
