import {
  Editor,
  Element,
  Node,
  NodeEntry,
  NodeMatch,
  Text,
  Value,
} from '../../..'

export const NodeQueries = {
  /**
   * Check if a node entry is a match.
   */

  isNodeMatch(
    editor: Editor,
    entry: NodeEntry,
    match: NodeMatch | NodeMatch[]
  ) {
    const [node] = entry

    // If match is an array, treat it as an OR condition.
    if (Array.isArray(match)) {
      for (const m of match) {
        if (Editor.isNodeMatch(editor, entry, m)) {
          return true
        }
      }

      return false
    }

    switch (match) {
      case 'text':
        return Text.isText(node)
      case 'value':
        return Value.isValue(node)
      case 'element':
        return Element.isElement(node)
      case 'inline':
        return (
          (Element.isElement(node) && editor.isInline(node)) ||
          Text.isText(node)
        )
      case 'inline-element':
        return Element.isElement(node) && editor.isInline(node)
      case 'block':
        return (
          Element.isElement(node) &&
          !editor.isInline(node) &&
          Editor.hasInlines(editor, node)
        )
      case 'void':
        return Element.isElement(node) && editor.isVoid(node)
    }

    if (typeof match === 'function') {
      return match(entry)
    } else {
      return Node.matches(node, match)
    }
  },
}
