import { Element } from 'slate'

export const input = {
  source: 'heading-large',
  children: [{ text: '' }],
}
export const test = value => {
  return Element.isElementType(value, 'paragraph', 'source')
}

export const output = false
