import { Location } from './location'
import { Node } from './node'
import { Path } from './path'
import { Range } from './range'
import { Scrubber } from './scrubber'

export type EditorError<T extends SlateErrorType = SlateErrorType> = {
  /**
   * The unique key of the operation and the specific error.
   * The key format: `<methodName>.<case>`
   */
  key: string

  /**
   * Contextual error description.
   */
  message: string

  /**
   * Underlying generic error.
   */
  error?: SlateError<T>

  /**
   * Additional data related to the operation that caused the error for custom handling.
   */
  data?: unknown

  /**
   * Experimental recovery value instead of throwing an error.
   * Used as returned value only if `editor.strict = false`.
   */
  recovery?: unknown
}

export type SlateError<T extends SlateErrorType = SlateErrorType> = {
  /**
   * Error type.
   */
  type: T

  /**
   * Error description.
   */
  message: string
}

export const SlateErrors = {
  EditorNext: () => ({
    type: 'EditorNext' as const,
    message: `Cannot get the next node from the root node!`,
  }),
  EditorPoint: (edge: string, at: Location) => ({
    type: 'EditorPoint' as const,
    message: `Cannot get the ${edge} point in the node at path [${at}] because it has no ${edge} text node.`,
  }),
  EditorPrevious: () => ({
    type: 'EditorPrevious' as const,
    message: `Cannot get the previous node from the root node!`,
  }),
  NodeAncestor: (node: Node, path: Path) => ({
    type: 'NodeAncestor' as const,
    message: `Cannot get the ancestor node at path [${path}] because it refers to a text node instead: ${Scrubber.stringify(
      node
    )}`,
  }),
  NodeChildText: (root: Node) => ({
    type: 'NodeChildText' as const,
    message: `Cannot get the child of a text node: ${Scrubber.stringify(root)}`,
  }),
  NodeChildIndex: (root: Node, index: number) => ({
    type: 'NodeChildIndex' as const,
    message: `Cannot get child at index \`${index}\` in node: ${Scrubber.stringify(
      root
    )}`,
  }),
  NodeDescendant: (node: Node, path: Path) => ({
    type: 'NodeDescendant' as const,
    message: `Cannot get the descendant node at path [${path}] because it refers to the root editor node instead: ${Scrubber.stringify(
      node
    )}`,
  }),
  NodeFragment: (root: Node) => ({
    type: 'NodeFragment' as const,
    message: `Cannot get a fragment starting from a root text node: ${Scrubber.stringify(
      root
    )}`,
  }),
  NodeGet: (root: Node, path: Path) => ({
    type: 'NodeGet' as const,
    message: `Cannot find a descendant at path [${path}] in node: ${Scrubber.stringify(
      root
    )}`,
  }),
  NodeLeaf: (node: Node, path: Path) => ({
    type: 'NodeLeaf' as const,
    message: `Cannot get the leaf node at path [${path}] because it refers to a non-leaf node: ${Scrubber.stringify(
      node
    )}`,
  }),
  NodeParent: (path: Path) => ({
    type: 'NodeParent' as const,
    message: `Cannot get the parent of path [${path}] because it does not exist in the root.`,
  }),
  PathNext: (path: Path) => ({
    type: 'PathNext' as const,
    message: `Cannot get the next path of a root path [${path}], because it has no next index.`,
  }),
  PathParent: (path: Path) => ({
    type: 'PathParent' as const,
    message: `Cannot get the parent path of the root path [${path}].`,
  }),
  PathPrevious: (path: Path) => ({
    type: 'PathPrevious' as const,
    message: `Cannot get the previous path of a root path [${path}], because it has no previous index.`,
  }),
  PathPreviousChild: (path: Path) => ({
    type: 'PathPreviousChild' as const,
    message: `Cannot get the previous path of a first child path [${path}] because it would result in a negative index.`,
  }),
  PathRelative: (path: Path, ancestor: Path) => ({
    type: 'PathRelative' as const,
    message: `Cannot get the relative path of [${path}] inside ancestor [${ancestor}], because it is not above or equal to the path.`,
  }),
  TransformsSelect: (target: Range) => ({
    type: 'TransformsSelect' as const,
    message: `When setting the selection and the current selection is \`null\` you must provide at least an \`anchor\` and \`focus\`, but you passed: ${Scrubber.stringify(
      target
    )}`,
  }),
}

export type SlateErrorType = keyof typeof SlateErrors
