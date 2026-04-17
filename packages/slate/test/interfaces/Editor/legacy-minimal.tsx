import { Editor, Operation } from 'slate'

export const input: Editor = {
  apply: (_operation: Operation) => {},
  children: [],
  exec: () => {},
  isInline: () => false,
  isVoid: () => false,
  normalizeNode: () => {},
  onChange: () => {},
  operations: [],
  selection: null,
}

export const test = value => {
  return (
    typeof value.apply === 'function' &&
    Array.isArray(value.children) &&
    value.selection === null
  )
}

export const output = true
