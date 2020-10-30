import {SlateRange} from 'slate'

export const input = {
  anchor: {
    path: [0],
    offset: 0,
  },
  focus: {
    path: [0],
    offset: 0,
  },
}
export const test = range => {
  return SlateRange.isExpanded(range)
}
export const output = false
