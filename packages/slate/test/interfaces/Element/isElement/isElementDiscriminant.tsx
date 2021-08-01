import { Element } from 'slate'

export const input = {
  source: 'heading-large',
  children: [{ text: '' }],
}
export const test = value => {
  return Element.isElementType(value, 'heading-large', 'source')
}

export const output = true
