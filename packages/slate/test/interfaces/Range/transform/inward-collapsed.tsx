import { Range } from 'slate'

export const input = {
  anchor: {
    path: [0, 0],
    offset: 1,
  },
  focus: {
    path: [0, 0],
    offset: 1,
  },
}
export const test = value => {
  return Range.transform(
    value,
    {
      type: 'split_node',
      path: [0, 0],
      position: 1,
      properties: {},
    },
    { affinity: 'inward' }
  )
}
export const output = {
  anchor: {
    path: [0, 1],
    offset: 0,
  },
  focus: {
    path: [0, 1],
    offset: 0,
  },
}
