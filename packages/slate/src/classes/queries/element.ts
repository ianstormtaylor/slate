import { Editor, Element, Text } from '../..'

class ElementQueries {
  /**
   * Check if a node has block children.
   */

  hasBlocks(this: Editor, element: Element): boolean {
    return element.children.some(n => Element.isElement(n) && !this.isInline(n))
  }

  /**
   * Check if a node has inline and text children.
   */

  hasInlines(this: Editor, element: Element): boolean {
    return element.children.some(
      n => Text.isText(n) || (Element.isElement(n) && this.isInline(n))
    )
  }

  /**
   * Check if a node has text children.
   */

  hasTexts(this: Editor, element: Element): boolean {
    return element.children.every(n => Text.isText(n))
  }

  /**
   * Check if an element is empty, accounting for void nodes.
   */

  isEmpty(this: Editor, element: Element): boolean {
    const { children } = element
    const [first] = children
    return (
      children.length === 0 ||
      (children.length === 1 &&
        Text.isText(first) &&
        first.text === '' &&
        !this.isVoid(element))
    )
  }

  /**
   * Check if a node is an inline, meaning that it lives intermixed with text
   * nodes in the document tree.
   */

  isInline(this: Editor, element: Element): boolean {
    return false
  }

  /**
   * Check if a node is a void, meaning that Slate considers its content a black
   * box. It will be edited as if it has no content.
   */

  isVoid(this: Editor, element: Element): boolean {
    return false
  }
}

export default ElementQueries
