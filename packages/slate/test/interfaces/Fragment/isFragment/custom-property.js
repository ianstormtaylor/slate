import { Fragment } from 'slate'

export const input = {
  nodes: [],
  custom: true,
}

export const test = value => {
  return Fragment.isFragment(value)
}

export const output = true
