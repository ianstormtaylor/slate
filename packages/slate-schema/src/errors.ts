import { Ancestor, Descendant, Node, Path } from 'slate'

export interface ChildInvalidError {
  code: 'child_invalid'
  node: Descendant
  path: Path
}

export interface ChildMaxInvalidError {
  code: 'child_max_invalid'
  node: Descendant
  path: Path
  count: number
  max: number
}

export interface ChildMinInvalidError {
  code: 'child_min_invalid'
  node: Descendant | undefined
  path: Path
  count: number
  min: number
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

export interface NodeLeafInvalidError {
  code: 'node_leaf_invalid'
  node: Node
  path: Path
  property: string
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

export type NodeError =
  | ChildInvalidError
  | ChildMaxInvalidError
  | ChildMinInvalidError
  | FirstChildInvalidError
  | LastChildInvalidError
  | NextSiblingInvalidError
  | NodeLeafInvalidError
  | NodePropertyInvalidError
  | NodeTextInvalidError
  | ParentInvalidError
  | PreviousSiblingInvalidError

export type SchemaError = NodeError
