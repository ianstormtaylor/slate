import { Element } from 'slate'

export const input = {
  nodes: [],
  selection: null,
  annotations: {},
}

export const test = value => {
  return Element.isElement(value)
}

export const output = false
