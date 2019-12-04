import {
  NodeEntry,
  Node,
  Text,
  Mark,
  Editor,
  MarkEntry,
  AncestorEntry,
  Descendant,
  DescendantEntry,
} from 'slate'

import { MarkError, NodeError } from './errors'
import { NodeRule, MarkRule, ChildValidation } from './rules'

/**
 * Check a mark object.
 */

export const checkMark = (
  editor: Editor,
  entry: MarkEntry,
  rule: MarkRule
): MarkError | undefined => {
  const { validate: v } = rule
  const [mark, index, node, path] = entry

  if ('properties' in v) {
    for (const k in v.properties) {
      const p = v.properties[k]
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
  rule: NodeRule,
  rules: NodeRule[]
): NodeError | undefined => {
  const { match: m, validate: v } = rule
  const [node, path] = entry

  if (Editor.isMatch(editor, entry, m)) {
    if ('properties' in v) {
      for (const k in v.properties) {
        const p = v.properties[k]
        const value = node[k]
        const isInvalid = typeof p === 'function' ? !p(value) : p !== value

        if (isInvalid) {
          return { code: 'node_property_invalid', node, path, property: k }
        }
      }
    }

    if ('marks' in v && v.marks != null) {
      for (const entry of Node.marks(node)) {
        if (!Editor.isMarkMatch(editor, entry, v.marks)) {
          const [mark, index, n, p] = entry
          return { code: 'mark_invalid', node: n, path: p, mark, index }
        }
      }
    }

    if ('text' in v && v.text != null) {
      const text = Node.text(node)

      if (!v.text(text)) {
        return { code: 'node_text_invalid', node, path, text }
      }
    }

    if (!Text.isText(node)) {
      if ('first' in v && v.first != null && node.children.length !== 0) {
        const n = Node.child(node, 0)
        const p = path.concat(0)

        if (!Editor.isMatch(editor, [n, p], v.first)) {
          return { code: 'first_child_invalid', node: n, path: p, index: 0 }
        }
      }

      if ('last' in v && v.last != null && node.children.length !== 0) {
        const i = node.children.length - 1
        const n = Node.child(node, i)
        const p = path.concat(i)

        if (!Editor.isMatch(editor, [n, p], v.last)) {
          return { code: 'last_child_invalid', node: n, path: p, index: i }
        }
      }
    }
  }
}

/**
 * Check an ancestor node object's children.
 */

export const checkAncestor = (
  editor: Editor,
  entry: AncestorEntry,
  rule: NodeRule,
  parentRules: NodeRule[]
): [NodeRule, NodeError] | undefined => {
  const { validate: v } = rule
  const [parent, parentPath] = entry
  const processed = new Set()
  const isMatch = Editor.isMatch(editor, entry, rule.match)
  const groups = 'children' in v && v.children != null ? v.children : []
  let index = 0
  let count = 0
  let g = 0

  while (true) {
    const group = groups[g] as ChildValidation | undefined
    const child = parent.children[index] as Descendant | undefined
    const childPath = parentPath.concat(index)

    // For each child check the parent-related validations. But ensure that we
    // only ever check each child once, which isn't guaranteed since we're not
    // iterating just over the children in one go.
    if (child && !processed.has(child)) {
      processed.add(child)

      for (const r of parentRules) {
        const e = checkParent(editor, entry, [child, childPath], r)

        if (e) {
          return [r, e]
        }
      }
    }

    // If we're out of children and groups we're done.
    if (!child && !group) {
      break
    }

    // If the entry doesn't match the rule, then the `children` validation is
    // irrelevant, so just keep iterating the children.
    if (!isMatch) {
      if (child) {
        index++
        continue
      } else {
        break
      }
    }

    // If we're out of groups, just continue iterating the children.
    if (!group) {
      index++
      continue
    }

    if (
      child &&
      Editor.isMatch(editor, [child, childPath], group.match || {})
    ) {
      count++
    }
    // Since we want to report overflow on last matching child we don't
    // immediately v for count > max, but instead do so once we find
    // a child that doesn't match.
    if (child && group.max != null && count > group.max) {
      if (g < groups.length - 1 && (group.min == null || count >= group.min)) {
        g++
        count = 0
        continue
      } else {
        return [
          rule,
          {
            code: 'child_max_invalid',
            node: child,
            path: childPath,
            count,
            max: group.max,
          },
        ]
      }
    }

    // If there's no child, we're either done, we're in an optional group, or
    // we're missing a child in a group with a mininmum set.
    if (!child) {
      if (group.min != null && count < group.min) {
        return [
          rule,
          {
            code: 'child_min_invalid',
            node: child,
            path: childPath,
            count,
            min: group.min,
          },
        ]
      } else {
        g++
        count = 0
        continue
      }
    }

    if (Editor.isMatch(editor, [child, childPath], group.match || {})) {
      index++
      continue
    }

    // If there are more children definitions after this one, then this
    // child might actually be valid for a future one.
    if (g + 1 < groups.length) {
      // If we've already satisfied the current child definition's minimum
      // then we can proceed to the next definition.
      if (group.min == null || count >= group.min) {
        g++
        count = 0
        continue
      }

      // The current group might be missing an element, and the child is
      // actually a member of the next group. If so, the next validation
      // won't report errors, and we can break to error out as minimum.
      const nc = groups[g + 1]

      if (nc && Editor.isMatch(editor, [child, childPath], nc.match || {})) {
        return [
          rule,
          {
            code: 'child_min_invalid',
            node: child,
            path: childPath,
            count,
            min: group.min,
          },
        ]
      }
    }

    return [rule, { code: 'child_invalid', node: child, path: childPath }]
  }
}

/**
 * Check a parent node object's children.
 */

export const checkParent = (
  editor: Editor,
  entry: AncestorEntry,
  childEntry: DescendantEntry,
  rule: NodeRule
): NodeError | undefined => {
  const { match: m, validate: v } = rule
  const [parent, parentPath] = entry
  const [child, childPath] = childEntry
  const index = childPath[childPath.length - 1]

  if (
    'parent' in v &&
    v.parent != null &&
    Editor.isMatch(editor, [child, childPath], m) &&
    !Editor.isMatch(editor, [parent, parentPath], v.parent)
  ) {
    return {
      code: 'parent_invalid',
      node: parent,
      path: parentPath,
      index,
    }
  }

  if (
    'previous' in v &&
    v.previous != null &&
    index > 0 &&
    Editor.isMatch(editor, [child, childPath], m)
  ) {
    const prevChild = Node.child(parent, index - 1)
    const prevPath = parentPath.concat(index - 1)

    if (!Editor.isMatch(editor, [prevChild, prevPath], v.previous)) {
      return {
        code: 'previous_sibling_invalid',
        node: prevChild,
        path: prevPath,
      }
    }
  }

  if (
    'next' in v &&
    v.next != null &&
    index < parent.children.length - 1 &&
    Editor.isMatch(editor, [child, childPath], m)
  ) {
    const nextChild = Node.child(parent, index + 1)
    const nextPath = parentPath.concat(index + 1)

    if (!Editor.isMatch(editor, [nextChild, nextPath], v.next)) {
      return {
        code: 'next_sibling_invalid',
        node: nextChild,
        path: nextPath,
      }
    }
  }
}
