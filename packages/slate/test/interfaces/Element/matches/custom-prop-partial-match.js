import { Mark } from 'slate'

export const input = {
  element: { nodes: [], type: 'bold', other: true },
  props: { type: 'bold' },
}

export const test = ({ element, props }) => {
  return Mark.matches(element, props)
}

export const output = true
