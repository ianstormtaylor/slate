import { Element } from 'slate'
import { isHeadingElement } from './type-guards'

export const input: Element = {
  type: 'heading',
  level: 5,
  children: [],
}

export const test = isHeadingElement

export const output = true
