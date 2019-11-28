import { Element } from 'slate'

export const input = [
  {
    children: [],
    selection: null,
    operations: [],
    apply() {},
    exec() {},
    isInline() {},
    isVoid() {},
    normalizeNode() {},
    onChange() {},
  },
]

export const test = value => {
  return Element.isElementList(value)
}

export const output = false
