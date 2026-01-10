import { Location, Path } from 'slate'

export const input: Path = []
export const test = (value: typeof input) => {
  return Location.isPath(value)
}
export const output = true
