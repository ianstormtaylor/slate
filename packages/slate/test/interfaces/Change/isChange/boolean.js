import { Change } from 'slate'

export const input = true

export const test = value => {
  return Change.isChange(value)
}

export const output = false
