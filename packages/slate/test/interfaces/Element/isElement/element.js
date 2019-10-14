import { Element } from 'slate'

export const input = {
  nodes: [],
}

export const test = value => {
  return Element.isElement(value)
}

export const output = true
