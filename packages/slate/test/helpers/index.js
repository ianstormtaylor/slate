import { createHyperscript } from 'slate-hyperscript'

export const jsx = createHyperscript({
  elements: {
    block: {},
    inline: { inline: true },
  },
})

export const TestPlugin = Editor => {
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
