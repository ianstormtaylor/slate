import { Mark } from 'slate'

export const input = {
  mark: { type: 'bold' },
  props: { type: 'italic' },
}

export const test = ({ mark, props }) => {
  return Mark.matches(mark, props)
}

export const output = false
