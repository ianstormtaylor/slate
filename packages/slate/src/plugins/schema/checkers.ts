import {
  Ancestor,
  Annotation,
  Element,
  Mark,
  Node,
  Path,
  Text,
  Value,
} from '../..'
import { SchemaError } from './error'
import { SchemaRule, SchemaCheck } from './rule'

/**
 * Check an annotation object.
 */

export const checkAnnotation = (
  annotation: Annotation,
  key: string,
  check: SchemaCheck
): SchemaError | undefined => {
  if (typeof check === 'function') {
    if (check(annotation)) {
      return
    } else {
      return { code: 'annotation_invalid', annotation, key }
    }
  }

  if (
    'object' in check &&
    check.object === 'annotation' &&
    !Annotation.isAnnotation(annotation)
  ) {
    return { code: 'annotation_object_invalid', annotation, key }
  }

  if ('properties' in check) {
    for (const k in check.properties) {
      const fn = check.properties[k]
      const value = annotation[k]

      if (!fn(value)) {
        return {
          code: 'annotation_property_invalid',
          annotation,
          key,
          property: k,
        }
      }
    }
  }
}

/**
 * Check a mark object.
 */

export const checkMark = (
  mark: Mark,
  index: number,
  node: Text,
  path: Path,
  check: SchemaCheck
): SchemaError | undefined => {
  if (typeof check === 'function') {
    if (check(mark)) {
      return
    } else {
      return { code: 'mark_invalid', mark, index, node, path }
    }
  }

  if ('object' in check && check.object === 'mark' && !Mark.isMark(mark)) {
    return { code: 'mark_object_invalid', mark, index, node, path }
  }

  if ('properties' in check) {
    for (const k in check.properties) {
      const p = check.properties[k]
      const value = mark[k]

      if ((typeof p === 'function' && !p(value)) || p !== value) {
        return {
          code: 'mark_property_invalid',
          mark,
          index,
          node,
          path,
          property: k,
        }
      }
    }
  }
}

/**
 * Check a node object.
 */

export const checkNode = (
  node: Node,
  path: Path,
  check: SchemaCheck,
  rules: SchemaRule[]
): SchemaError | undefined => {
  if (typeof check === 'function') {
    if (check(node)) {
      return
    } else {
      return { code: 'node_invalid', node, path }
    }
  }

  if (
    'object' in check &&
    ((check.object === 'value' && !Value.isValue(node)) ||
      (check.object === 'element' && !Element.isElement(node)) ||
      (check.object === 'text' && !Text.isText(node)))
  ) {
    return { code: 'node_object_invalid', node, path }
  }

  if ('properties' in check) {
    for (const k in check.properties) {
      const p = check.properties[k]
      const value = node[k]

      if ((typeof p === 'function' && !p(value)) || p !== value) {
        return { code: 'node_property_invalid', node, path, property: k }
      }
    }
  }

  if ('marks' in check && check.marks != null) {
    for (const [mark, index, n, p] of Node.marks(node)) {
      for (const c of check.marks) {
        const e = checkMark(mark, index, n, path.concat(p), c)

        if (e) {
          return e
        }
      }
    }
  }

  if ('text' in check && check.text != null) {
    const text = Node.text(node)
    const valid =
      typeof check.text === 'function'
        ? check.text(text)
        : check.text.test(text)

    if (!valid) {
      return { code: 'node_text_invalid', node, path, text }
    }
  }

  if (!Text.isText(node)) {
    const error = checkAncestor(node, path, check, rules)

    if (error) {
      return error
    }
  }
}

/**
 * Check an ancestor object.
 */

export const checkAncestor = (
  node: Ancestor,
  path: Path,
  check: SchemaCheck,
  rules: SchemaRule[]
): SchemaError | undefined => {
  if ('first' in check && check.first != null && node.nodes.length !== 0) {
    const n = Node.child(node, 0)
    const p = path.concat(0)
    const e = checkNode(n, p, check.first, rules)

    if (e) {
      if (e.code === 'node_invalid') {
        return { ...e, code: 'first_child_invalid', node: n, index: 0 }
      } else if (e.code === 'node_object_invalid') {
        return { ...e, code: 'first_child_object_invalid', node: n, index: 0 }
      } else if (e.code === 'node_property_invalid') {
        return { ...e, code: 'first_child_property_invalid', node: n, index: 0 }
      }
    }
  }

  if ('last' in check && check.last != null && node.nodes.length !== 0) {
    const i = node.nodes.length - 1
    const n = Node.child(node, i)
    const p = path.concat(i)
    const e = checkNode(n, p, check.last, rules)

    if (e) {
      if (e.code === 'node_invalid') {
        return { ...e, code: 'last_child_invalid', node: n, index: i }
      } else if (e.code === 'node_object_invalid') {
        return { ...e, code: 'last_child_object_invalid', node: n, index: i }
      } else if (e.code === 'node_property_invalid') {
        return { ...e, code: 'last_child_property_invalid', node: n, index: i }
      }
    }
  }

  const processed = new Set()
  let d = 0
  let m = 0
  let i = 0

  while (i < node.nodes.length) {
    const n = Node.child(node, i)
    const p = path.concat(i)

    if (!processed.has(i)) {
      for (const rule of rules) {
        if (
          ('parent' in check ||
            ('previous' in check && i > 0) ||
            ('next' in check && i < node.nodes.length - 1)) &&
          checkNode(n, p, rule.match, rules) === undefined
        ) {
          if ('parent' in check && check.parent != null) {
            const e = checkNode(node, path, check.parent, rules)

            if (e) {
              if (e.code === 'node_invalid') {
                return { ...e, index: i, node, code: 'parent_invalid' }
              } else if (e.code === 'node_object_invalid') {
                return { ...e, index: i, node, code: 'parent_object_invalid' }
              } else if (e.code === 'node_property_invalid') {
                return { ...e, index: i, node, code: 'parent_property_invalid' }
              }
            }
          }

          if ('previous' in check && check.previous != null) {
            const prevN = Node.child(node, i - 1)
            const prevP = path.concat(i - 1)
            const e = checkNode(prevN, prevP, check.previous, rules)

            if (e) {
              if (e.code === 'node_invalid') {
                return { ...e, code: 'previous_sibling_invalid' }
              } else if (e.code === 'node_object_invalid') {
                return { ...e, code: 'previous_sibling_object_invalid' }
              } else if (e.code === 'node_property_invalid') {
                return { ...e, code: 'previous_sibling_property_invalid' }
              }
            }
          }

          if ('next' in check && check.next != null) {
            const nextN = Node.child(node, i + 1)
            const nextP = path.concat(i + 1)
            const e = checkNode(nextN, nextP, check.next, rules)

            if (e) {
              if (e.code === 'node_invalid') {
                return { ...e, code: 'next_sibling_invalid' }
              } else if (e.code === 'node_object_invalid') {
                return { ...e, code: 'next_sibling_object_invalid' }
              } else if (e.code === 'node_property_invalid') {
                return { ...e, code: 'next_sibling_property_invalid' }
              }
            }
          }
        }
      }
    }

    processed.add(i)

    if ('children' in check && check.children != null) {
      const child = check.children[d]
      const max = child.max != null ? child.max : Infinity
      const min = child.min != null ? child.min : 0

      // If the children assertion was defined, but we don't current have a
      // definition, we've reached the end so any other children are overflows.
      if (!child) {
        return { code: 'child_overflow', node: n, path: p, index: i }
      }

      if (child.match != null) {
        const e = checkNode(n, p, child.match, rules)

        if (e) {
          // Since we want to report overflow on last matching child we don't
          // immediately check for count > max, but instead do so once we find
          // a child that doesn't match.
          if (m - 1 > max) {
            return {
              code: 'child_max_invalid',
              node: n,
              path: p,
              index: i,
              count: m,
              max,
            }
          }

          // If there are more children definitions after this one, then this
          // child might actually be valid for a future one.
          if (check.children.length > d + 1) {
            // If we've already satisfied the current child definition's minimum
            // then we can proceed to the next definition.
            if (m >= min) {
              d++
              continue
            }

            // There might just not be enough elements for current group, and
            // current child is in fact the first of the next group. If so, the
            // next def will not report errors, in which case we can rewind and
            // report an minimum error.
            const nextChild = check.children[d + 1]

            if (
              nextChild &&
              nextChild.match != null &&
              checkNode(n, p, nextChild.match, rules) === undefined
            ) {
              return {
                code: 'child_min_invalid',
                node: n,
                path: p,
                index: i,
                count: m,
                min,
              }
            }
          }

          // Otherwise either we exhausted the last group, in which case it's
          // an unknown child, ...
          if (m > max) {
            return { code: 'child_overflow', node: n, path: p, index: i }
          }

          // ... or it's an invalid child.
          if (e.code === 'node_invalid') {
            return { ...e, node: n, path: p, index: i, code: 'child_invalid' }
          } else if (e.code === 'node_object_invalid') {
            return {
              ...e,
              code: 'child_object_invalid',
              node: n,
              path: p,
              index: i,
            }
          } else if (e.code === 'node_property_invalid') {
            return {
              ...e,
              code: 'child_property_invalid',
              node: n,
              path: p,
              index: i,
            }
          }
        }
      }
    }

    i++
  }
}
