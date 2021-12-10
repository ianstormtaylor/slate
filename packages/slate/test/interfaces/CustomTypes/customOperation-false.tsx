import { Operation } from 'slate'
import { isCustomOperation } from './type-guards'

export const input: Operation = {
  type: 'insert_text',
  path: [0, 0],
  offset: 0,
  text: 'text',
}

export const test = isCustomOperation

export const output = false
