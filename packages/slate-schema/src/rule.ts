import { Editor, AnnotationMatch, NodeMatch, MarkMatch } from 'slate'
import { NodeError, MarkError, AnnotationError } from './error'

export interface AnnotationValidation {
  properties?: Record<string, any>
}

export interface AnnotationRule {
  for: 'annotation'
  match: AnnotationMatch
  validate: AnnotationValidation
  normalize: (editor: Editor, error: AnnotationError) => void
}

export interface MarkValidation {
  properties?: Record<string, any>
}

export interface MarkRule {
  for: 'mark'
  match: MarkMatch
  validate: MarkValidation
  normalize: (editor: Editor, error: MarkError) => void
}

export interface ChildValidation {
  match?: NodeMatch[]
  min?: number
  max?: number
}

export interface NodeValidation {
  children?: ChildValidation[]
  first?: NodeMatch[]
  last?: NodeMatch[]
  marks?: MarkMatch[]
  next?: NodeMatch[]
  parent?: NodeMatch[]
  previous?: NodeMatch[]
  properties?: Record<string, any>
  text?: (text: string) => boolean
}

export interface NodeRule {
  for: 'node'
  match: NodeMatch
  validate: NodeValidation
  normalize: (editor: Editor, error: NodeError) => void
}

export type SchemaRule = AnnotationRule | MarkRule | NodeRule
