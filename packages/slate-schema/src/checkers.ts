import {
  NodeEntry,
  Node,
  Text,
  Mark,
  Editor,
  MarkEntry,
  AnnotationEntry,
} from 'slate'

import { AnnotationError, MarkError, NodeError } from './error'
import {
  NodeRule,
  NodeValidation,
  AnnotationValidation,
  MarkValidation,
} from './rule'

/**
 * Check an annotation object.
 */

export const checkAnnotation = (
  editor: Editor,
  entry: AnnotationEntry,
  check: AnnotationValidation
): AnnotationError | undefined => {
  const [annotation, key] = entry

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
  editor: Editor,
  entry: MarkEntry,
  check: MarkValidation
): MarkError | undefined => {
  const [mark, index, node, path] = entry

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
  editor: Editor,
  entry: NodeEntry,
  check: NodeValidation,
  rules: NodeRule[]
): NodeError | undefined => {
  const [node, path] = entry

  if ('properties' in check) {
    for (const k in check.properties) {
      const p = check.properties[k]
      const value = node[k]
      const isInvalid = typeof p === 'function' ? !p(value) : p !== value

      if (isInvalid) {
        return { code: 'node_property_invalid', node, path, property: k }
      }
    }
  }

  if ('marks' in check && check.marks != null) {
    for (const [mark, index, n, p] of Node.marks(node)) {
      if (!check.marks.some(c => Mark.matches(mark, c))) {
        return { code: 'mark_invalid', node: n, path: p, mark, index }
      }
    }
  }

  if ('text' in check && check.text != null) {
    const text = Node.text(node)

    if (!check.text(text)) {
      return { code: 'node_text_invalid', node, path, text }
    }
  }

  if (Text.isText(node)) {
    return
  }

  if ('first' in check && check.first != null && node.nodes.length !== 0) {
    const n = Node.child(node, 0)
    const p = path.concat(0)

    if (!editor.isNodeMatch(entry, check.first)) {
      return { code: 'first_child_invalid', node: n, path: p, index: 0 }
    }
  }

  if ('last' in check && check.last != null && node.nodes.length !== 0) {
    const i = node.nodes.length - 1
    const n = Node.child(node, i)
    const p = path.concat(i)

    if (!editor.isNodeMatch(entry, check.last)) {
      return { code: 'last_child_invalid', node: n, path: p, index: i }
    }
  }

  const processed = new Set()
  let d = 0
  let m = 1
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
          editor.isNodeMatch([n, p], rule.match)
        ) {
          if ('parent' in check && check.parent != null) {
            if (!editor.isNodeMatch(entry, check.parent)) {
              return { code: 'parent_invalid', node, path, index: i }
            }
          }

          if ('previous' in check && check.previous != null) {
            const prevN = Node.child(node, i - 1)
            const prevP = path.concat(i - 1)

            if (!editor.isNodeMatch([prevN, prevP], check.previous)) {
              return {
                code: 'previous_sibling_invalid',
                node: prevN,
                path: prevP,
              }
            }
          }

          if ('next' in check && check.next != null) {
            const nextN = Node.child(node, i + 1)
            const nextP = path.concat(i + 1)

            if (!editor.isNodeMatch([nextN, nextP], check.next)) {
              return { code: 'next_sibling_invalid', node: nextN, path: nextP }
            }
          }
        }
      }
    }

    processed.add(i)

    if ('children' in check && check.children != null) {
      const child = check.children[d]
      const { match = {}, max = Infinity, min = 0 } = child

      // If the children assertion was defined, but we don't current have a
      // definition, we've reached the end so any other children are overflows.
      if (!child) {
        return { code: 'child_unexpected', node: n, path: p, index: i }
      }

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

      // Otherwise either we exhausted the last group, in which case it's
      // an unexpected child that has overflowed.
      if (m > max) {
        return { code: 'child_unexpected', node: n, path: p, index: i }
      }

      if (!editor.isNodeMatch([n, p], match)) {
        // If there are more children definitions after this one, then this
        // child might actually be valid for a future one.
        if (check.children.length > d + 1) {
          // If we've already satisfied the current child definition's minimum
          // then we can proceed to the next definition.
          if (m >= min) {
            d++
            m = 1
            continue
          }

          // There might just not be enough elements for current group, and
          // current child is in fact the first of the next group. If so, the
          // next def will not report errors, in which case we can rewind and
          // report an minimum error.
          const nextChild = check.children[d + 1]

          if (nextChild && editor.isNodeMatch([n, p], nextChild.match || {})) {
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

        return { code: 'child_invalid', node: n, path: p, index: i }
      }
    }

    i++
    m++
  }
}
