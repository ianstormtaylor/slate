import { createHyperscript } from 'slate-hyperscript'

export const jsx = createHyperscript({
  elements: {
    block: {},
    inline: { inline: true },
  },
})

export const withHelpers = Editor => {
  return class extends Editor {
    isInline(node) {
      return node.inline === true ? true : super.isInline(node)
    }

    isVoid(node) {
      return node.void === true ? true : super.isVoid(node)
    }
  }
}
