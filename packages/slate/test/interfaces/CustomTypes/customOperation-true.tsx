import { Operation } from 'slate'
import { isCustomOperation } from './type-guards'

export const input: Operation = {
  type: 'custom_op',
  value: 'some value',
}

export const test = isCustomOperation

export const output = true
