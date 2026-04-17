import { Path } from '../..'

export const validateOperationPathIndexes = (
  path: Path,
  prefix: string
): void => {
  for (const index of path) {
    if (typeof index !== 'number') {
      throw new Error(`${prefix} because path indexes must be numbers.`)
    }
  }
}
