import { Annotation } from 'slate'

export const input = {
  anchor: {
    path: [0, 1],
    offset: 0,
  },
  focus: {
    path: [0, 1],
    offset: 0,
  },
}

export const test = value => {
  return Annotation.isAnnotationRecord(value)
}

export const output = false
