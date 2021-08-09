import { Element } from 'slate'

export const input = {
  type: 'paragraph',
  children: [{ text: '' }],
}
export const test = value => Element.isElementType(value, 'paragraph')

export const output = true
