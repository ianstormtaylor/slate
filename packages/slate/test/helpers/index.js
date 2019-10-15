import { Element } from 'slate'
import { createHyperscript } from 'slate-hyperscript'

const h = createHyperscript({
  elements: {
    block: { kind: 'block' },
    inline: { kind: 'inline' },
    void_block: { kind: 'void_block' },
    void_inline: { kind: 'void_inline' },
  },
  annotations: {
    atomic_annotation: { kind: 'atomic_annotation' },
  },
})

const TestPlugin = Editor => {
  return class extends Editor {
    isBlock(node) {
      return Element.isElement(node) && node.kind.endsWith('block')
    }

    isInline(node) {
      return Element.isElement(node) && node.kind.endsWith('inline')
    }

    isVoid(node) {
      return Element.isElement(node) && node.kind.startsWith('void_')
    }

    isAtomic(mark) {
      return mark.kind.startsWith('atomic_')
    }
  }
}

export { h, TestPlugin }
