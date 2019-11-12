import { Editor, Path, Text } from 'slate'

import { NodeRule, SchemaRule, AnnotationRule, MarkRule } from './rules'
import { NodeError } from './errors'
import { checkNode, checkAncestor } from './checkers'

/**
 * `SchemaEditor` is a Slate editor class with `withSchema` mixed in.
 */

export type SchemaEditor = InstanceType<ReturnType<typeof withSchema>>

/**
 * The `withSchema` mixin augments an editor to ensure that its value is
 * normalized to always obey a schema after operations are applied.
 */

export const withSchema = (
  Editor: new (...args: any[]) => Editor,
  rules: SchemaRule[] = []
) => {
  const annotationRules: AnnotationRule[] = []
  const markRules: MarkRule[] = []
  const nodeRules: NodeRule[] = []
  const ancestorRules: NodeRule[] = []

  for (const rule of rules) {
    if (rule.for === 'annotation') {
      annotationRules.push(rule)
    } else if (rule.for === 'mark') {
      markRules.push(rule)
    } else {
      nodeRules.push(rule)

      if (
        'parent' in rule.validate ||
        'next' in rule.validate ||
        'previous' in rule.validate
      ) {
        ancestorRules.push(rule)
      }
    }
  }

  return class extends Editor {
    /**
     * Normalize a node at a path with the schema's rules, returning it to a
     * valid state if it is currently invalid.
     */

    normalizeNodes(options: { at: Path }): void {
      const { at } = options
      const entry = this.getNode(at)
      const [n, p] = entry
      let error: NodeError | undefined
      let rule: NodeRule | undefined

      for (const r of nodeRules) {
        let e = checkNode(this, entry, r, nodeRules)

        if (!e && !Text.isText(n)) {
          e = checkAncestor(this, [n, p], r, ancestorRules)
        }

        if (e) {
          error = e
          rule = r
          break
        }
      }

      if (error == null) {
        return super.normalizeNodes(options)
      }

      const prevLength = this.operations.length

      // First run the user-provided `normalize` function if one exists...
      if (rule != null && rule.normalize) {
        rule.normalize(this, error)
      }

      // If the `normalize` function did add any operations to the editor,
      // we assume that it fully handled the normalization and exit.
      if (this.operations.length > prevLength) {
        return
      }

      switch (error.code) {
        case 'first_child_invalid':
        case 'last_child_invalid': {
          const { path } = error
          const [parent, parentPath] = this.getParent(path)

          if (parent.nodes.length > 1) {
            this.removeNodes({ at: path })
          } else if (parentPath.length === 0) {
            const range = this.getRange(parentPath)
            this.removeNodes({ at: range, match: ([, p]) => p.length === 1 })
          } else {
            this.removeNodes({ at: parentPath })
          }

          break
        }

        case 'child_max_invalid': {
          const { node, path, index } = error

          if (node.nodes.length === 1 && path.length !== 0) {
            this.removeNodes({ at: path })
          } else {
            this.removeNodes({ at: path.concat(index) })
          }

          break
        }

        case 'child_min_invalid': {
          const { path } = error

          if (path.length === 0) {
            const range = this.getRange(path)
            this.removeNodes({ at: range, match: ([, p]) => p.length === 1 })
          } else {
            this.removeNodes({ at: path })
          }

          break
        }

        case 'child_invalid':
        case 'child_unexpected':
        case 'next_sibling_invalid':
        case 'node_property_invalid':
        case 'node_text_invalid':
        case 'previous_sibling_invalid': {
          const { path } = error
          this.removeNodes({ at: path })
          break
        }

        case 'mark_invalid': {
          const { mark, path } = error
          this.removeMarks([mark], { at: path })
          break
        }

        case 'parent_invalid': {
          const { path, index } = error
          const childPath = path.concat(index)
          this.removeNodes({ at: childPath })
          break
        }

        default: {
          const _: never = error
          throw new Error(
            `Cannot normalize unknown validation error: "${JSON.stringify(
              error
            )}"`
          )
        }
      }
    }
  }
}
