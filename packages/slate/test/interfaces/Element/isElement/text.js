import { Element } from 'slate'

export const input = {
  text: '',
  marks: [],
}

export const test = value => {
  return Element.isElement(value)
}

export const output = false
