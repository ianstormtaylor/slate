import { Ancestor, Descendant, Range, Mark, Node, Path, Text } from 'slate'

export interface AnnotationInvalidError {
  code: 'annotation_invalid'
  annotation: Range
  key: string
}

export interface AnnotationObjectInvalidError {
  code: 'annotation_object_invalid'
  annotation: Range
  key: string
}

export interface AnnotationPropertyInvalidError {
  code: 'annotation_property_invalid'
  annotation: Range
  key: string
  property: string
}

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

export interface ChildObjectInvalidError {
  code: 'child_object_invalid'
  node: Descendant
  path: Path
  index: number
}

export interface ChildUnexpectedError {
  code: 'child_unexpected'
  node: Descendant
  path: Path
  index: number
}

export interface ChildPropertyInvalidError {
  code: 'child_property_invalid'
  node: Descendant
  path: Path
  index: number
  property: string
}

export interface FirstChildInvalidError {
  code: 'first_child_invalid'
  node: Descendant
  path: Path
  index: number
}

export interface FirstChildObjectInvalidError {
  code: 'first_child_object_invalid'
  node: Descendant
  path: Path
  index: number
}

export interface FirstChildPropertyInvalidError {
  code: 'first_child_property_invalid'
  node: Descendant
  path: Path
  index: number
  property: string
}

export interface LastChildInvalidError {
  code: 'last_child_invalid'
  node: Descendant
  path: Path
  index: number
}

export interface LastChildObjectInvalidError {
  code: 'last_child_object_invalid'
  node: Descendant
  path: Path
  index: number
}

export interface LastChildPropertyInvalidError {
  code: 'last_child_property_invalid'
  node: Descendant
  path: Path
  index: number
  property: string
}

export interface NextSiblingInvalidError {
  code: 'next_sibling_invalid'
  node: Node
  path: Path
}

export interface NextSiblingObjectInvalidError {
  code: 'next_sibling_object_invalid'
  node: Node
  path: Path
}

export interface NextSiblingPropertyInvalidError {
  code: 'next_sibling_property_invalid'
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

export interface NodeInvalidError {
  code: 'node_invalid'
  node: Node
  path: Path
}

export interface NodePropertyInvalidError {
  code: 'node_property_invalid'
  node: Node
  path: Path
  property: string
}

export interface NodeObjectInvalidError {
  code: 'node_object_invalid'
  node: Node
  path: Path
}

export interface MarkInvalidError {
  code: 'mark_invalid'
  mark: Mark
  index: number
  node: Text
  path: Path
}

export interface MarkObjectInvalidError {
  code: 'mark_object_invalid'
  mark: Mark
  index: number
  node: Text
  path: Path
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

export interface ParentObjectInvalidError {
  code: 'parent_object_invalid'
  node: Ancestor
  path: Path
  index: number
}

export interface ParentPropertyInvalidError {
  code: 'parent_property_invalid'
  node: Ancestor
  path: Path
  index: number
  property: string
}

export interface PreviousSiblingInvalidError {
  code: 'previous_sibling_invalid'
  node: Node
  path: Path
}

export interface PreviousSiblingObjectInvalidError {
  code: 'previous_sibling_object_invalid'
  node: Node
  path: Path
}

export interface PreviousSiblingPropertyInvalidError {
  code: 'previous_sibling_property_invalid'
  node: Node
  path: Path
  property: string
}

export type AnnotationSchemaError =
  | AnnotationInvalidError
  | AnnotationObjectInvalidError
  | AnnotationPropertyInvalidError

export type MarkSchemaError =
  | MarkInvalidError
  | MarkObjectInvalidError
  | MarkPropertyInvalidError

export type NodeSchemaError =
  | ChildInvalidError
  | ChildMaxInvalidError
  | ChildMinInvalidError
  | ChildObjectInvalidError
  | ChildUnexpectedError
  | ChildPropertyInvalidError
  | FirstChildInvalidError
  | FirstChildObjectInvalidError
  | FirstChildPropertyInvalidError
  | LastChildInvalidError
  | LastChildObjectInvalidError
  | LastChildPropertyInvalidError
  | NextSiblingInvalidError
  | NextSiblingObjectInvalidError
  | NextSiblingPropertyInvalidError
  | NodeInvalidError
  | NodeObjectInvalidError
  | NodePropertyInvalidError
  | NodeTextInvalidError
  | ParentInvalidError
  | ParentObjectInvalidError
  | ParentPropertyInvalidError
  | PreviousSiblingInvalidError
  | PreviousSiblingObjectInvalidError
  | PreviousSiblingPropertyInvalidError

export type SchemaError =
  | AnnotationSchemaError
  | MarkSchemaError
  | NodeSchemaError
