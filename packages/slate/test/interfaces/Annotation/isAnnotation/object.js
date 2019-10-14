import { Annotation } from 'slate'

export const input = {}

export const test = value => {
  return Annotation.isAnnotation(value)
}

export const output = false
