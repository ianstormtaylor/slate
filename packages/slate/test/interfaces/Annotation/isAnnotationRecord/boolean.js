import { Annotation } from 'slate'

export const input = true

export const test = value => {
  return Annotation.isAnnotationRecord(value)
}

export const output = false
