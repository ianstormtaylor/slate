import { Editor, Element, Node, NodeEntry, NodeMatch, Text } from '../../..'

export const NodeQueries = {
  /**
   * Check if a node entry is a match.
   */

  isMatch(editor: Editor, entry: NodeEntry, match: NodeMatch): boolean {
    if (Array.isArray(match)) {
      return match.some(m => Editor.isMatch(editor, entry, m))
    }

    const [node] = entry

    switch (match) {
      case 'text':
        return Text.isText(node)
      case 'editor':
        return Editor.isEditor(node)
      case 'element':
        return Element.isElement(node)
      case 'inline':
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
