import { Editor, Text, NodeEntry } from 'slate'

import { NodeRule, SchemaRule, MarkRule } from './rules'
import { NodeError } from './errors'
import { checkNode, checkAncestor } from './checkers'

/**
 * The `withSchema` plugin augments an editor to ensure that its content is
 * normalized to always obey a schema after operations are applied.
 */

export const withSchema = (
  editor: Editor,
  rules: SchemaRule[] = []
): Editor => {
  const { normalizeNode } = editor
  const markRules: MarkRule[] = []
  const nodeRules: NodeRule[] = []
  const ancestorRules: NodeRule[] = []

  for (const rule of rules) {
    if (rule.for === 'mark') {
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

  editor.normalizeNode = (entry: NodeEntry) => {
    const [n, p] = entry
    let error: NodeError | undefined
    let rule: NodeRule | undefined

    for (const r of nodeRules) {
      let e = checkNode(editor, entry, r, nodeRules)

      if (!e && !Text.isText(n)) {
        e = checkAncestor(editor, [n, p], r, ancestorRules)
      }

      if (e) {
        error = e
        rule = r
        break
      }
    }

    if (error == null) {
      return normalizeNode(entry)
    }

    const prevLength = editor.operations.length

    // First run the user-provided `normalize` function if one exists...
    if (rule != null && rule.normalize) {
      rule.normalize(editor, error)
    }

    // If the `normalize` function did add any operations to the editor,
    // we assume that it fully handled the normalization and exit.
    if (editor.operations.length > prevLength) {
      return
    }

    switch (error.code) {
      case 'first_child_invalid':
      case 'last_child_invalid': {
        const { path } = error
        const [parent, parentPath] = Editor.parent(editor, path)

        if (parent.children.length > 1) {
          Editor.removeNodes(editor, { at: path })
        } else if (parentPath.length === 0) {
          const range = Editor.range(editor, parentPath)
          Editor.removeNodes(editor, {
            at: range,
            match: ([, p]) => p.length === 1,
          })
        } else {
          Editor.removeNodes(editor, { at: parentPath })
        }

        break
      }

      case 'child_max_invalid': {
        const { node, path, index } = error

        if (node.children.length === 1 && path.length !== 0) {
          Editor.removeNodes(editor, { at: path })
        } else {
          Editor.removeNodes(editor, { at: path.concat(index) })
        }

        break
      }

      case 'child_min_invalid': {
        const { path } = error

        if (path.length === 0) {
          const range = Editor.range(editor, path)
          Editor.removeNodes(editor, {
            at: range,
            match: ([, p]) => p.length === 1,
          })
        } else {
          Editor.removeNodes(editor, { at: path })
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
        Editor.removeNodes(editor, { at: path })
        break
      }

      case 'mark_invalid': {
        const { mark, path } = error
        Editor.removeMarks(editor, [mark], { at: path })
        break
      }

      case 'parent_invalid': {
        const { path, index } = error
        const childPath = path.concat(index)
        Editor.removeNodes(editor, { at: childPath })
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

  return editor
}
