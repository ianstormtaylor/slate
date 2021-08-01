import { Element } from 'slate'

export const input = {
  type: 'heading-large',
  children: [{ text: '' }],
}
export const test = value => {
  return Element.isElementType(value, 'heading-large')
}

export const output = true
