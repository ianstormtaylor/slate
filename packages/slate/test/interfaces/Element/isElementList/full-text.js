import { Element } from 'slate'

export const input = [
  {
    text: '',
    marks: [],
  },
]

export const test = value => {
  return Element.isElementList(value)
}

export const output = false
