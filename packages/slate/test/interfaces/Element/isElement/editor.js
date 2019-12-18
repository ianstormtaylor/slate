import { Element } from 'slate'

export const input = {
  children: [],
  operations: [],
  selection: null,
  marks: null,
  apply() {},
  exec() {},
  isInline() {},
  isVoid() {},
  normalizeNode() {},
  onChange() {},
}

export const test = value => {
  return Element.isElement(value)
}

export const output = false
