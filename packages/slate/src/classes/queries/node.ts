import { Editor, Node, Element, Text } from '../..'

class NodeQueries {
  /**
   * Check if a node is a block, meaning it lives at the level above text nodes
   * in the document tree.
   */

  isBlock(this: Editor, node: Node): node is Element {
    return Element.isElement(node)
  }

  /**
   * Check if a node is an inline, meaning that it lives intermixed with text
   * nodes in the document tree.
   */

  isInline(this: Editor, node: Node): node is Element {
    return false
  }

  /**
   * Check if a node is a leaf block node.
   */

  isLeafBlock(this: Editor, node: Node): node is Element {
    return this.isBlock(node) && !this.isBlock(node.nodes[0])
  }

  /**
   * Check if a node is a leaf inline node.
   */

  isLeafInline(this: Editor, node: Node): node is Element {
    return this.isInline(node) && node.nodes.every(n => Text.isText(n))
  }

  /**
   * Check if a node is a void, meaning that Slate considers its content a black
   * box. It will be edited as if it has no content.
   */

  isVoid(this: Editor, node: Node): node is Element {
    return false
  }
}

export default NodeQueries
