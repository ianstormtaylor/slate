import { Location, Path } from 'slate'

export const input: Path = [0, 1]
export const test = (value: typeof input) => {
  return Location.isRange(value)
}
export const output = false
