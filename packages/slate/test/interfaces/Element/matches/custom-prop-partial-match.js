import { Mark } from 'slate'

export const input = {
  element: { children: [], type: 'bold', other: true },
  props: { type: 'bold' },
}

export const test = ({ element, props }) => {
  return Mark.matches(element, props)
}

export const output = true
