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

    isInline(node) {
      return node.inline === true ? true : super.isInline(node)
    }

    isVoid(node) {
      return node.void === true ? true : super.isVoid(node)
    }
  }
}

export { h, TestPlugin }
