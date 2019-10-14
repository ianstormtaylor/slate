import { Annotation } from 'slate'

export const input = {}

export const test = value => {
  return Annotation.isAnnotationRecord(value)
}

export const output = true
