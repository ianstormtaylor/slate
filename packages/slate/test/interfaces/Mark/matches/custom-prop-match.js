import { Mark } from 'slate'

export const input = {
  mark: { type: 'bold' },
  another: { type: 'bold' },
}

export const test = ({ mark, props }) => {
  return Mark.matches(mark, props)
}

export const output = true
