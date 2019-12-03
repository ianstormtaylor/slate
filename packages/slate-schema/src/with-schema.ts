import { Editor, Text, NodeEntry } from 'slate'

import { NodeRule, SchemaRule, MarkRule } from './rules'
import { NodeError } from './errors'
import { checkNode, checkAncestor } from './checkers'

/**
 * The `withSchema` plugin augments an editor to ensure that its content is
 * normalized to always obey a schema after operations are applied.
 *
 * The parameters are curried so that it can easily be composed with other plugins.
 * For example (using flowRight from lodash):
 *
 * editor = _.flowRight(
 *    withHistory,
 *    withSchema(rules),
 * )(editor);
 */

type IWithSchema = {
  (rules: SchemaRule[]): (editor: Editor) => Editor
  (rules: SchemaRule[], editor: Editor): Editor
}

export const withSchema: IWithSchema = (
  rules: SchemaRule[] = [],
  editor?: Editor
): any => {
  if (editor === undefined) {
    return (editor: Editor) => withSchema(rules, editor)
  }

  const { normalizeNode } = editor
  const markRules: MarkRule[] = []
  const nodeRules: NodeRule[] = []
  const parentRules: NodeRule[] = []

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
        parentRules.push(rule)
      }
    }
  }

  editor.normalizeNode = (entry: NodeEntry) => {
    const [n, p] = entry
    let error: NodeError | undefined
    let rule: NodeRule | undefined

    for (const r of nodeRules) {
      error = checkNode(editor, [n, p], r, nodeRules)

      if (error) {
        rule = r
        break
      }

      if (!Text.isText(n)) {
        const failure = checkAncestor(editor, [n, p], r, parentRules)

        if (failure) {
          rule = failure[0]
          error = failure[1]
          break
        }
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
        const { path } = error
        const [parent, parentPath] = Editor.parent(editor, path)

        if (parent.children.length === 1 && parentPath.length !== 0) {
          Editor.removeNodes(editor, { at: parentPath })
        } else {
          Editor.removeNodes(editor, { at: path })
        }

        break
      }

      case 'child_min_invalid': {
        const { path } = error
        const [, parentPath] = Editor.parent(editor, path)

        if (parentPath.length === 0) {
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

      case 'child_invalid':
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
