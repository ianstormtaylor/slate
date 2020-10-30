import {SlateRange} from 'slate'

export const input = {
  anchor: {
    path: [0],
    offset: 0,
  },
  focus: {
    path: [3],
    offset: 0,
  },
}
export const test = range => {
  return SlateRange.isCollapsed(range)
}
export const output = false
