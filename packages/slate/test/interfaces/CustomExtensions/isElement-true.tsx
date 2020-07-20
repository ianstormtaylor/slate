// show that regular methods that are imported work as expected
import {
  Element,
  Node,
  CustomExtensions,
  ExtendedType,
  Descendant,
} from 'slate'

declare module 'slate' {
  interface CustomExtensions {
    Element:
      | { type: 'heading'; level: number; children: Descendant[] }
      | { type: 'list-item'; depth: number; children: Descendant[] }
  }
}

const extension: CustomExtensions = {
  Element: { type: 'heading', level: 5, children: [] },
}

export const input = extension.Element as Element

export const test = (value: Element) => {
  return Element.isElement(value)
}

export const output = true
