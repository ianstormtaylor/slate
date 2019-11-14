import { Mark } from 'slate'

export const input = {
  element: { children: [], type: 'bold' },
  props: {},
}

export const test = ({ mark, props }) => {
  return Mark.matches(mark, props)
}

export const output = true
