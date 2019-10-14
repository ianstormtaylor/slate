import { Element } from 'slate'

export const input = [
  {
    nodes: [],
    selection: null,
    annotations: {},
  },
]

export const test = value => {
  return Element.isElementList(value)
}

export const output = true
