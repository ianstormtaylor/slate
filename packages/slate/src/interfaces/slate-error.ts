import { Path } from './path'
import { Range } from './range'
import { Scrubber } from './scrubber'

export const SlateError = {
  EditorNext: () => ({
    type: 'EditorNext',
    message: `Cannot get the next node from the root node!`,
  }),
  PathNext: (path: Path) => ({
    type: 'PathNext',
    message: `Cannot get the next path of a root path [${path}], because it has no next index.`,
  }),
  PathParent: (path: Path) => ({
    type: 'PathParent',
    message: `Cannot get the parent path of the root path [${path}].`,
  }),
  PathPrevious: (path: Path) => ({
    type: 'PathPrevious',
    message: `Cannot get the previous path of a root path [${path}], because it has no previous index.`,
  }),
  PathPreviousChild: (path: Path) => ({
    type: 'PathPreviousChild',
    message: `Cannot get the previous path of a first child path [${path}] because it would result in a negative index.`,
  }),
  PathRelative: (path: Path, ancestor: Path) => ({
    type: 'PathRelative',
    message: `Cannot get the relative path of [${path}] inside ancestor [${ancestor}], because it is not above or equal to the path.`,
  }),
  TransformsSelect: (target: Range) => ({
    type: 'TransformsSelect',
    message: `When setting the selection and the current selection is \`null\` you must provide at least an \`anchor\` and \`focus\`, but you passed: ${Scrubber.stringify(
      target
    )}`,
  }),
}

export type SlateErrorType = keyof typeof SlateError
