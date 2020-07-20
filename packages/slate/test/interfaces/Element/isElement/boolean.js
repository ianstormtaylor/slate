import { Element } from 'slate'

export const input = true

export const test = value => {
  return Element.isElement(value)
} // $ExpectType string

export const output = false
