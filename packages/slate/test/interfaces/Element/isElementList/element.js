import { Element } from 'slate'

export const input = {
  nodes: [],
}

export const test = value => {
  return Element.isElementList(value)
}

export const output = false
