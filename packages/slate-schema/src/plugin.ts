import { EditorPlugin, EditorConstructor, Element, Node, Path } from 'slate'
import { SchemaError } from './error'
import { SchemaRule } from './rule'
import { checkNode } from './checkers'

const SchemaPlugin: EditorPlugin = (
  options: {
    rules?: SchemaRule[]
    value?: Omit<SchemaRule, 'match'>
    annotations?: {
      [type: string]: Omit<SchemaRule, 'match'>
    }
    blocks?: {
      [type: string]: Omit<SchemaRule, 'match'>
    }
    inlines?: {
      [type: string]: Omit<SchemaRule, 'match'>
    }
    marks?: {
      [type: string]: Omit<SchemaRule, 'match'>
    }
  } = {}
) => {
  const rules = options.rules ? [...options.rules] : []
  const {
    value,
    blocks = {},
    inlines = {},
    marks = {},
    annotations = {},
  } = options

  if (value) {
    rules.push({ match: { object: 'value' }, ...value })
  }

  for (const type in blocks) {
    const rule = blocks[type]
    rules.push({
      match: { object: 'element', properties: { type } },
      ...rule,
      define: {
        ...rule.define,
        isInline: false,
      },
    })
  }

  for (const type in inlines) {
    const rule = inlines[type]
    rules.push({
      match: { object: 'element', properties: { type } },
      ...rule,
      define: {
        ...rule.define,
        isInline: true,
      },
    })
  }

  for (const type in marks) {
    rules.push({
      match: { object: 'mark', properties: { type } },
      ...marks[type],
    })
  }

  for (const type in annotations) {
    rules.push({
      match: { object: 'annotation', properties: { type } },
      ...annotations[type],
    })
  }

  return (Editor: EditorConstructor) => {
    return class extends Editor {
      /**
       * Check if a node is inline based on the schema rules.
       */

      isInline(element: Element): boolean {
        // HACK: The node-checking logic needs a path for creating an error with
        // details. But we don't care about the error, so we use a fake path.
        const path: Path = []

        for (const rule of rules) {
          if (
            rule.define != null &&
            rule.define.isInline != null &&
            checkNode(element, path, rule.match, rules) == null
          ) {
            return rule.define.isInline
          }
        }

        return super.isInline(element)
      }

      /**
       * Check if a node is void based on the schema rules.
       */

      isVoid(element: Element): boolean {
        // HACK: The node-checking logic needs a path for creating an error with
        // details. But we don't care about the error, so we use a fake path.
        const path: Path = []

        for (const rule of rules) {
          if (
            rule.define != null &&
            rule.define.isVoid != null &&
            checkNode(element, path, rule.match, rules) == null
          ) {
            return rule.define.isVoid
          }
        }

        return super.isVoid(element)
      }

      /**
       * Normalize a node at a path with the schema's rules, returning it to a
       * valid state if it is currently invalid.
       */

      normalizeNodes(options: { at: Path }): void {
        const { at } = options
        const [node] = this.getNode(at)
        let error: SchemaError | undefined
        let rule: SchemaRule | undefined

        for (const r of rules) {
          if (r.match == null || r.validate == null) {
            continue
          }

          const isMatch = !checkNode(node, at, r.match, rules)

          if (!isMatch) {
            continue
          }

          const e = checkNode(node, at, r.validate, rules)

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
          case 'annotation_invalid':
          case 'annotation_object_invalid':
          case 'annotation_property_invalid': {
            const { key } = error
            this.removeAnnotation(key)
            break
          }

          case 'child_max_invalid':
          case 'child_min_invalid':
          case 'first_child_invalid':
          case 'first_child_object_invalid':
          case 'first_child_property_invalid':
          case 'last_child_invalid':
          case 'last_child_object_invalid':
          case 'last_child_property_invalid': {
            const { code, path } = error
            const [parent, parentPath] = this.getParent(path)

            if (parent.nodes.length > 1 || code === 'child_min_invalid') {
              this.removeNodes({ at: path })
            } else if (parentPath.length === 0) {
              const range = this.getRange(parentPath)
              this.removeNodes({ at: range, match: 1 })
            } else {
              this.removeNodes({ at: parentPath })
            }

            break
          }

          case 'child_invalid':
          case 'child_object_invalid':
          case 'child_property_invalid':
          case 'child_unexpected':
          case 'node_invalid':
          case 'node_object_invalid':
          case 'node_property_invalid':
          case 'node_text_invalid': {
            const { path } = error
            this.removeNodes({ at: path })
            break
          }

          case 'next_sibling_invalid':
          case 'next_sibling_object_invalid':
          case 'next_sibling_property_invalid': {
            const { path } = error
            const prevPath = Path.previous(path)
            this.removeNodes({ at: prevPath })
            break
          }

          case 'parent_invalid':
          case 'parent_object_invalid':
          case 'parent_property_invalid': {
            const { path, index } = error
            const childPath = path.concat(index)
            this.removeNodes({ at: childPath })
            break
          }

          case 'previous_sibling_invalid':
          case 'previous_sibling_object_invalid':
          case 'previous_sibling_property_invalid': {
            const { path } = error
            const nextPath = Path.next(path)
            this.removeNodes({ at: nextPath })
            break
          }

          case 'mark_invalid':
          case 'mark_object_invalid':
          case 'mark_property_invalid': {
            const { path, mark } = error
            this.removeMarks([mark], { at: path })
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
}

export { SchemaPlugin }
