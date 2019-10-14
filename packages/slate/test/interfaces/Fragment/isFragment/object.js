import { Fragment } from 'slate'

export const input = {}

export const test = value => {
  return Fragment.isFragment(value)
}

export const output = false
