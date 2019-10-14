import { Annotation } from 'slate'

export const input = {}

export const test = value => {
  return Annotation.isAnnotationMap(value)
}

export const output = true
