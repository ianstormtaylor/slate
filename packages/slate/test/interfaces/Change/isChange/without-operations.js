import { Change } from 'slate'

export const input = {
  value: {
    nodes: [],
    selection: null,
    annotations: {},
  },
}

export const test = value => {
  return Change.isChange(value)
}

export const output = false
