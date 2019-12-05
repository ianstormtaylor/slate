import { Editor, NodeMatch } from 'slate'
import { NodeError } from './errors'

export interface ChildValidation {
  match?: NodeMatch
  min?: number
  max?: number
}

export interface NodeValidation {
  children?: ChildValidation[]
  first?: NodeMatch
  last?: NodeMatch
  leaves?: Record<string, any>
  next?: NodeMatch
  parent?: NodeMatch
  previous?: NodeMatch
  properties?: Record<string, any>
  text?: (text: string) => boolean
}

export interface NodeRule {
  for: 'node'
  match: NodeMatch
  validate: NodeValidation
  normalize: (editor: Editor, error: NodeError) => void
}

export type SchemaRule = NodeRule
