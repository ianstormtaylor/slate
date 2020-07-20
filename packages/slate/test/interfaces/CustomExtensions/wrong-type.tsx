// show that regular methods that are imported work as expected
import { CustomExtensions, Element as BaseElement, Node } from 'slate'

declare module 'slate' {
  interface CustomExtensions {
    5: string
  }
}

// if Element does not have a 'children' property, it is not an element
const extension: CustomExtensions = {
  5: "I'm a number",
}

export const input = extension

export const test = (value: Element) => {
  return BaseElement.isElement(value)
}

export const output = false
