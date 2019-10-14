import { Annotation } from 'slate'

export const input = true

export const test = value => {
  return Annotation.isAnnotation(value)
}

export const output = false
