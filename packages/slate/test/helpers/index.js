import { Element } from 'slate'
import { createHyperscript } from 'slate-hyperscript'

const h = createHyperscript({
  elements: {
    block: {},
    inline: {},
    void_block: {},
    void_inline: {},
  },
  annotations: {
    atomic_annotation: {},
  },
})

const TestPlugin = Editor => {
  return class extends Editor {
    isInline(node) {
      return Element.isElement(node) && node.type === 'inline'
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
