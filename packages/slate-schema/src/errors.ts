import { Ancestor, Descendant, Range, Mark, Node, Path, Text } from 'slate'

export interface ChildInvalidError {
  code: 'child_invalid'
  node: Descendant
  path: Path
  index: number
}

export interface ChildMaxInvalidError {
  code: 'child_max_invalid'
  node: Descendant
  path: Path
  index: number
  count: number
  max: number
}

export interface ChildMinInvalidError {
  code: 'child_min_invalid'
  node: Descendant
  path: Path
  index: number
  count: number
  min: number
}

export interface ChildUnexpectedError {
  code: 'child_unexpected'
  node: Descendant
  path: Path
  index: number
}

export interface FirstChildInvalidError {
  code: 'first_child_invalid'
  node: Descendant
  path: Path
  index: number
}

export interface LastChildInvalidError {
  code: 'last_child_invalid'
  node: Descendant
  path: Path
  index: number
}

export interface NextSiblingInvalidError {
  code: 'next_sibling_invalid'
  node: Node
  path: Path
}

export interface NodePropertyInvalidError {
  code: 'node_property_invalid'
  node: Node
  path: Path
  property: string
}

export interface NodeTextInvalidError {
  code: 'node_text_invalid'
  node: Node
  path: Path
  text: string
}

export interface MarkInvalidError {
  code: 'mark_invalid'
  node: Text
  path: Path
  mark: Mark
  index: number
}

export interface MarkPropertyInvalidError {
  code: 'mark_property_invalid'
  mark: Mark
  index: number
  node: Text
  path: Path
  property: string
}

export interface ParentInvalidError {
  code: 'parent_invalid'
  node: Ancestor
  path: Path
  index: number
}

export interface PreviousSiblingInvalidError {
  code: 'previous_sibling_invalid'
  node: Node
  path: Path
}

export type MarkError = MarkPropertyInvalidError

export type NodeError =
  | ChildInvalidError
  | ChildMaxInvalidError
  | ChildMinInvalidError
  | ChildUnexpectedError
  | FirstChildInvalidError
  | LastChildInvalidError
  | MarkInvalidError
  | NextSiblingInvalidError
  | NodePropertyInvalidError
  | NodeTextInvalidError
  | ParentInvalidError
  | PreviousSiblingInvalidError

export type SchemaError = MarkError | NodeError
