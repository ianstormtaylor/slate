// show that regular methods that are imported work as expected
import {
  Element as BaseElement,
  Node,
  CustomExtensions,
  ExtendedType,
} from 'slate'

declare module 'slate' {
  interface CustomExtensions {
    Element:
    | { type: 'heading'; level: number; children: Node[] }
    | { type: 'list-item'; depth: number; children: Node[] }
    Text: { bold?: boolean; italic?: boolean }
  }
}

type Element = ExtendedType<'Element', BaseElement>

const extension: CustomExtensions = {
  Element: { type: 'heading', level: 5, children: [] },
  Text: { bold: true },
}

export const input = extension.Element as Element

export const test = (value: Element) => {
  return BaseElement.isElement(value)
}

export const output = true
