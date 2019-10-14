import {
  Ancestor,
  Annotation,
  Descendant,
  Element,
  Mark,
  Node,
  Path,
  Text,
} from '../..'

interface AnnotationInvalidError {
  code: 'annotation_invalid'
  annotation: Annotation
  key: string
}

interface AnnotationObjectInvalidError {
  code: 'annotation_object_invalid'
  annotation: Annotation
  key: string
}

interface AnnotationPropertyInvalidError {
  code: 'annotation_property_invalid'
  annotation: Annotation
  key: string
  property: string
}

interface ChildInvalidError {
  code: 'child_invalid'
  node: Descendant
  path: Path
  index: number
}

interface ChildMaxInvalidError {
  code: 'child_max_invalid'
  node: Descendant
  path: Path
  index: number
  count: number
  max: number
}

interface ChildMinInvalidError {
  code: 'child_min_invalid'
  node: Descendant
  path: Path
  index: number
  count: number
  min: number
}

interface ChildObjectInvalidError {
  code: 'child_object_invalid'
  node: Descendant
  path: Path
  index: number
}

interface ChildOverflowError {
  code: 'child_overflow'
  node: Descendant
  path: Path
  index: number
}

interface ChildPropertyInvalidError {
  code: 'child_property_invalid'
  node: Descendant
  path: Path
  index: number
  property: string
}

interface FirstChildInvalidError {
  code: 'first_child_invalid'
  node: Descendant
  path: Path
  index: number
}

interface FirstChildObjectInvalidError {
  code: 'first_child_object_invalid'
  node: Descendant
  path: Path
  index: number
}

interface FirstChildPropertyInvalidError {
  code: 'first_child_property_invalid'
  node: Descendant
  path: Path
  index: number
  property: string
}

interface LastChildInvalidError {
  code: 'last_child_invalid'
  node: Descendant
  path: Path
  index: number
}

interface LastChildObjectInvalidError {
  code: 'last_child_object_invalid'
  node: Descendant
  path: Path
  index: number
}

interface LastChildPropertyInvalidError {
  code: 'last_child_property_invalid'
  node: Descendant
  path: Path
  index: number
  property: string
}

interface NextSiblingInvalidError {
  code: 'next_sibling_invalid'
  node: Node
  path: Path
}

interface NextSiblingObjectInvalidError {
  code: 'next_sibling_object_invalid'
  node: Node
  path: Path
}

interface NextSiblingPropertyInvalidError {
  code: 'next_sibling_property_invalid'
  node: Node
  path: Path
  property: string
}

interface NodeTextInvalidError {
  code: 'node_text_invalid'
  node: Node
  path: Path
  text: string
}

interface NodeInvalidError {
  code: 'node_invalid'
  node: Node
  path: Path
}

interface NodePropertyInvalidError {
  code: 'node_property_invalid'
  node: Node
  path: Path
  property: string
}

interface NodeObjectInvalidError {
  code: 'node_object_invalid'
  node: Node
  path: Path
}

interface MarkInvalidError {
  code: 'mark_invalid'
  mark: Mark
  index: number
  node: Text
  path: Path
}

interface MarkObjectInvalidError {
  code: 'mark_object_invalid'
  mark: Mark
  index: number
  node: Text
  path: Path
}

interface MarkPropertyInvalidError {
  code: 'mark_property_invalid'
  mark: Mark
  index: number
  node: Text
  path: Path
  property: string
}

interface ParentInvalidError {
  code: 'parent_invalid'
  node: Ancestor
  path: Path
  index: number
}

interface ParentObjectInvalidError {
  code: 'parent_object_invalid'
  node: Ancestor
  path: Path
  index: number
}

interface ParentPropertyInvalidError {
  code: 'parent_property_invalid'
  node: Ancestor
  path: Path
  index: number
  property: string
}

interface PreviousSiblingInvalidError {
  code: 'previous_sibling_invalid'
  node: Node
  path: Path
}

interface PreviousSiblingObjectInvalidError {
  code: 'previous_sibling_object_invalid'
  node: Node
  path: Path
}

interface PreviousSiblingPropertyInvalidError {
  code: 'previous_sibling_property_invalid'
  node: Node
  path: Path
  property: string
}

type SchemaError =
  | AnnotationInvalidError
  | AnnotationObjectInvalidError
  | AnnotationPropertyInvalidError
  | ChildInvalidError
  | ChildMaxInvalidError
  | ChildMinInvalidError
  | ChildObjectInvalidError
  | ChildOverflowError
  | ChildPropertyInvalidError
  | FirstChildInvalidError
  | FirstChildObjectInvalidError
  | FirstChildPropertyInvalidError
  | LastChildInvalidError
  | LastChildObjectInvalidError
  | LastChildPropertyInvalidError
  | MarkInvalidError
  | MarkObjectInvalidError
  | MarkPropertyInvalidError
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

export { SchemaError }
