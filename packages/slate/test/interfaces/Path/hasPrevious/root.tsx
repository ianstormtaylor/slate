import { Path } from 'slate'

export const input = [0, 0]
export const test = path => {
  console.log(Path.hasPrevious(path));
  return Path.hasPrevious(path)
}
export const output = false;
