import { Annotation } from 'slate'

export const input = {
  focus: {
    path: [0, 1],
    offset: 0,
  },
}

export const test = value => {
  return Annotation.isAnnotation(value)
}

export const output = false
