import { Location, Point } from 'slate'

export const input: Point & { custom: string } = {
  path: [0, 1],
  offset: 2,
  custom: 'value',
}
export const test = (value: typeof input) => {
  return Location.isRange(value)
}
export const output = false
