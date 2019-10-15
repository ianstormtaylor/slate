import {
  Editor,
  Mark,
  Annotation,
  EditorConstructor,
  Element,
  Node,
  Path,
} from '../..'
import { SchemaError } from './error'
import { SchemaRule } from './rule'
import { checkNode, checkMark, checkAnnotation } from './checkers'

const SchemaPlugin = (
  options: {
    rules?: SchemaRule[]
    value?: Omit<SchemaRule, 'match'>
    annotations?: {
      [type: string]: Omit<SchemaRule, 'match'>
    }
    elements?: {
      [type: string]: Omit<SchemaRule, 'match'>
    }
    marks?: {
      [type: string]: Omit<SchemaRule, 'match'>
    }
  } = {}
) => {
  const { value, elements = {}, marks = {}, annotations = {} } = options
  const rules = options.rules ? [...options.rules] : []

  if (value) {
    rules.push({ match: { object: 'value' }, ...value })
  }

  for (const type in elements) {
    rules.push({
      match: { object: 'element', properties: { type } },
      ...elements[type],
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

  return (Base: EditorConstructor) => {
    return class extends Base {
      /**
       * Check if a mark is atomic based on the schema rules.
       */

      isAtomic(this: Editor, mark: Mark): boolean {
        // HACK: The mark-checking logic needs a node and a path for creating an
        // error with details. But we don't care about the error itself, so we
        // use fake details here.
        const index = 0
        const [node, path] = this.getFirstText([])

        for (const rule of rules) {
          if (
            rule.define != null &&
            rule.define.isAtomic != null &&
            ((Annotation.isAnnotation(mark) &&
              checkAnnotation(mark, '', rule.match) == null) ||
              checkMark(mark, index, node, path, rule.match) == null)
          ) {
            return rule.define.isAtomic
          }
        }

        return super.isAtomic(mark)
      }

      /**
       * Check if a node is inline based on the schema rules.
       */

      isInline(this: Editor, element: Element): boolean {
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

      isVoid(this: Editor, element: Element): boolean {
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

      normalizeNodeAtPath(this: Editor, path: Path): void {
        const node = Node.get(this.value, path)
        let error: SchemaError | undefined
        let rule: SchemaRule | undefined

        for (const r of rules) {
          if ('validate' in r) {
            const e = checkNode(node, path, r.match, rules)

            if (e) {
              error = e
              rule = r
              break
            }
          }
        }

        if (error == null) {
          return super.normalizeNodeAtPath(path)
        }

        const prevLength = this.operations.length

        // First run the user-provided `normalize` function if one exists...
        if (rule != null && rule.normalize) {
          rule.normalize.call(this, error)
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

          case 'child_invalid':
          case 'child_max_invalid':
          case 'child_object_invalid':
          case 'child_overflow':
          case 'first_child_invalid':
          case 'first_child_object_invalid':
          case 'last_child_invalid':
          case 'last_child_object_invalid':
          case 'next_sibling_invalid':
          case 'next_sibling_object_invalid':
          case 'node_invalid':
          case 'node_object_invalid':
          case 'node_text_invalid':
          case 'parent_invalid':
          case 'parent_object_invalid':
          case 'previous_sibling_invalid':
          case 'previous_sibling_object_invalid': {
            const { path } = error

            if (path.length === 0) {
              this.removeChildrenAtPath(path)
            } else {
              this.removeNodeAtPath(path)
            }

            break
          }

          case 'child_min_invalid': {
            const { path } = error

            if (path.length === 1) {
              this.removeChildrenAtPath([])
            } else {
              this.removeParentAtPath(path)
            }

            break
          }

          case 'child_property_invalid':
          case 'first_child_property_invalid':
          case 'last_child_property_invalid':
          case 'next_sibling_property_invalid':
          case 'node_property_invalid':
          case 'parent_property_invalid':
          case 'previous_sibling_property_invalid': {
            const { value } = this
            const { path, property } = error
            const node = Node.get(value, path)

            if (node[property] == null) {
              this.removeNodeAtPath(path)
            } else {
              this.setNodeAtPath(path, { [property]: null })
            }

            break
          }

          case 'mark_invalid':
          case 'mark_object_invalid':
          case 'mark_property_invalid': {
            const { path, mark } = error
            this.removeMarkAtPath(path, mark)
            break
          }
        }
      }
    }
  }
}

export default SchemaPlugin
