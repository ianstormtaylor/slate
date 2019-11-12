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

  isNodeMatch(this: Editor, entry: NodeEntry, match: NodeMatch) {
    const [node, path] = entry

    if (typeof match === 'function') {
      return match(entry)
    } else if (typeof match === 'number') {
      return path.length === match
    } else if (match === 'text') {
      return Text.isText(node)
    } else if (match === 'value') {
      return Value.isValue(node)
    } else if (match === 'inline') {
      return (
        (Element.isElement(node) && this.isInline(node)) || Text.isText(node)
      )
    } else if (match === 'block') {
      return (
        Element.isElement(node) && !this.isInline(node) && this.hasInlines(node)
      )
    } else if (match === 'void') {
      return Element.isElement(node) && this.isVoid(node)
    } else if (Path.isPath(match)) {
      return Path.equals(path, match)
    } else {
      return Node.matches(node, match)
    }
  }
}

export default NodeQueries
