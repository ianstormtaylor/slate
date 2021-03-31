import { Element } from 'slate'
import { isHeadingElement } from './type-guards'

export const input: Element = {
  type: 'list-item',
  depth: 5,
  children: [],
}

export const test = isHeadingElement

export const output = false
