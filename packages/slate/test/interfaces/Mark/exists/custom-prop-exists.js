import { Mark } from 'slate'

export const input = {
  mark: { type: 'bold' },
  marks: [{ type: 'bold' }],
}

export const test = ({ mark, marks }) => {
  return Mark.exists(mark, marks)
}

export const output = true
