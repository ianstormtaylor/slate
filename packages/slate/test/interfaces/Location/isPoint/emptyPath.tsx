import { Location, Path } from 'slate'

export const input: Path = []
export const test = (value: typeof input) => {
  return Location.isPoint(value)
}
export const output = false
