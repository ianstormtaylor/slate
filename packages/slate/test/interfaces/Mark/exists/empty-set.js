import { Mark } from 'slate'

export const input = {
  mark: {},
  marks: [],
}

export const test = ({ mark, marks }) => {
  return Mark.exists(mark, marks)
}

export const output = false
