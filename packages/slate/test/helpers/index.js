import { Element } from 'slate'
import { createHyperscript } from 'slate-hyperscript'

const h = createHyperscript({
  elements: {
    block: {},
    inline: { inline: true },
  },
})

const TestPlugin = Editor => {
  return class extends Editor {
    isAtomic(mark) {
      return mark.atomic === true ? true : super.isAtomic(mark)
    }

    isBlock(node) {
      return Element.isElement(node) && node.inline !== true
        ? true
        : super.isBlock(node)
    }

    isInline(node) {
      return Element.isElement(node) && node.inline === true
        ? true
        : super.isInline(node)
    }

    isVoid(node) {
      return Element.isElement(node) && node.void === true
        ? true
        : super.isVoid(node)
    }
  }
}

export { h, TestPlugin }
