import { Range } from 'slate'

/**
 * If a collapsed Range is transformed with affinity outward by an insert_text operation, it should expand.
 */

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
      type: 'insert_text',
      path: [0, 0],
      text: 'a',
      offset: 1,
      properties: {},
    },
    { affinity: 'outward' }
  )
}
export const output = {
  anchor: {
    path: [0, 0],
    offset: 1,
  },
  focus: {
    path: [0, 0],
    offset: 2,
  },
}
