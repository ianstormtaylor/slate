import { Mark } from 'slate'

export const input = {
  mark: { type: 'bold' },
  marks: [{ type: 'italic' }],
}

export const test = ({ mark, marks }) => {
  return Mark.exists(mark, marks)
}

export const output = false
