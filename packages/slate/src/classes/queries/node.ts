import {
  Editor,
  Element,
  Node,
  NodeEntry,
  NodeMatch,
  Path,
  Text,
  Value,
} from '../..'

class NodeQueries {
  /**
   * Check if a node entry is a match.
   */

  isNodeMatch(this: Editor, entry: NodeEntry, match: NodeMatch | NodeMatch[]) {
    const [node] = entry

    // If match is an array, treat it as an OR condition.
    if (Array.isArray(match)) {
      for (const m of match) {
        if (this.isNodeMatch(entry, m)) {
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
          (Element.isElement(node) && this.isInline(node)) || Text.isText(node)
        )
      case 'inline-element':
        return Element.isElement(node) && this.isInline(node)
      case 'block':
        return (
          Element.isElement(node) &&
          !this.isInline(node) &&
          this.hasInlines(node)
        )
      case 'void':
        return Element.isElement(node) && this.isVoid(node)
    }

    if (typeof match === 'function') {
      return match(entry)
    } else {
      return Node.matches(node, match)
    }
  }
}

export default NodeQueries
