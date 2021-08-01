import { Element } from 'slate'

export const input = {
  type: 'heading-large',
  children: [{ text: '' }],
}
export const test = value => Element.isElementType(value, 'paragraph')

export const output = false
