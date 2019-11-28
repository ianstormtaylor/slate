import { Editor, Element, Text } from '../../..'

export const ElementQueries = {
  /**
   * Check if a node has block children.
   */

  hasBlocks(editor: Editor, element: Element): boolean {
    return element.children.some(
      n => Element.isElement(n) && !editor.isInline(n)
    )
  },

  /**
   * Check if a node has inline and text children.
   */

  hasInlines(editor: Editor, element: Element): boolean {
    return element.children.some(
      n => Text.isText(n) || (Element.isElement(n) && editor.isInline(n))
    )
  },

  /**
   * Check if a node has text children.
   */

  hasTexts(editor: Editor, element: Element): boolean {
    return element.children.every(n => Text.isText(n))
  },

  /**
   * Check if an element is empty, accounting for void nodes.
   */

  isEmpty(editor: Editor, element: Element): boolean {
    const { children } = element
    const [first] = children
    return (
      children.length === 0 ||
      (children.length === 1 &&
        Text.isText(first) &&
        first.text === '' &&
        !editor.isVoid(element))
    )
  },
}
