import { Node, Text } from 'slate'

/**
 * Render a Slate `Node` to a plaintext string.
 *
 * By default, it will use `\n` as the delimiter, separating each block-level
 * element with a line break.
 */

export const renderPlaintext = (
  node: Node,
  options: {
    delimiter?: string
  } = {}
): string => {
  const { delimiter = '\n' } = options

  if (Text.isText(node) || node.nodes.some(n => Text.isText(n))) {
    return Node.text(node)
  } else {
    return node.nodes.map(n => renderPlaintext(n, options)).join(delimiter)
  }
}
