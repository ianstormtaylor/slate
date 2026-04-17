import { Node } from '..'

export const NON_SETTABLE_NODE_PROPERTIES: Array<keyof Node | string> = [
  'children',
  'text',
  ...Object.getOwnPropertyNames(Object.prototype),
]

export const NON_SETTABLE_SELECTION_PROPERTIES = Object.getOwnPropertyNames(
  Object.prototype
)
