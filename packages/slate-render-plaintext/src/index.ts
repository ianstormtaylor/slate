import { Element, Node, Text } from 'slate'

/**
 * Render a Slate `Node` to a plaintext string.
 *
 * By default, it will use `\n` as the delimiter, separating each block-level
 * element with a line break.
 *
 * Note: If you need to, you can pass in your own custom `isInline` function
 * which is used to determine which element nodes are "inline vs. block". By
 * default it checks to see if the element has any text children.
 */

export const renderPlaintext = (
  node: Node,
  options: {
    delimiter?: string
    isInline?: (element: Element) => boolean
  } = {}
): string => {
  const {
    delimiter = '\n',
    isInline = (element: Element) => element.nodes.some(n => Text.isText(n)),
  } = options

  if (Text.isText(node) || (Element.isElement(node) && isInline(node))) {
    return Node.text(node)
  } else {
    return node.nodes.map(n => renderPlaintext(n, options)).join(delimiter)
  }
}
