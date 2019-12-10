import { Editor, Element, Node, NodeMatch, Text } from '../../..'

export const NodeQueries = {
  /**
   * Check if a node entry is a match.
   */

  isMatch(editor: Editor, node: Node, match: NodeMatch): boolean {
    if (Array.isArray(match)) {
      return match.some(m => Editor.isMatch(editor, node, m))
    }

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
      return match(node, editor)
    } else {
      return Node.matches(node, match)
    }
  },
}
