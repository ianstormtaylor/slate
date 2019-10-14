import { Fragment } from 'slate'

export const input = {
  nodes: [],
}

export const test = value => {
  return Fragment.isFragment(value)
}

export const output = true
