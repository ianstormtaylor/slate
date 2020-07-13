// shows that type discrimination works as expected
import { Element as BaseElement, CustomExtensions, ExtendedType } from 'slate'

declare module 'slate' {
  interface CustomExtensions {
    Element:
      | { type: 'heading'; level: number }
      | { type: 'list-item'; depth: number }
    Text: { bold?: boolean; italic?: boolean }
  }
}

type Element = ExtendedType<'Element', BaseElement>

const extension: CustomExtensions = {
  Element: { type: 'heading', level: 5 },
  Text: { bold: true },
}

export const input = extension.Element as Element

export const test = (element: Element) => {
  if (element.type !== 'heading') throw new Error(`Must be a heading`)
  // Uncomment `element.depth` and you get a TypeScript error as desired
  // element.depth
  return element.level
}

export const output = 5
