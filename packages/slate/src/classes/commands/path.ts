import { produce } from 'immer'
import {
  Editor,
  Fragment,
  Mark,
  Element,
  Text,
  Node,
  NodeEntry,
  Path,
  Descendant,
  Value,
} from '../..'

class PathCommands {
  /**
   * Merge the leaf block at a path with the previous leaf block.
   */

  mergeBlockAtPath(this: Editor, path: Path): void {
    this.withoutNormalizing(() => {
      const { value } = this
      const closestBlock = this.getClosestBlock(path)
      const prevBlock = this.getPreviousLeafBlock(path)

      if (!closestBlock) {
        throw new Error(
          `Cannot merge the leaf block above path [${path}] because there isn't one.`
        )
      }

      if (!prevBlock) {
        throw new Error(
          `Cannot merge the block above path [${path}] with the previous leaf block because there isn't one.`
        )
      }

      const [, blockPath] = closestBlock
      const [prev, prevPath] = prevBlock
      const newPath = Path.next(prevPath)
      const commonPath = Path.common(blockPath, prevPath)
      const furthest = Node.furthest(value, blockPath, ([n, p]) => {
        return (
          Path.isDescendant(p, commonPath) &&
          Path.isAncestor(p, blockPath) &&
          Element.isElement(n) &&
          n.nodes.length === 1
        )
      })

      const furthestRef = furthest ? this.createPathRef(furthest[1]) : null

      this.moveNodes({ at: blockPath, to: newPath })

      if (furthestRef) {
        this.removeNodes({ at: furthestRef.unref()! })
      }

      // If the target block is empty, remove it instead of merging. This is a
      // rich text editor common behavior to prevent losing block formatting
      // when deleting the entire previous block (with a hanging selection).
      if (this.isEmpty(prev)) {
        this.removeNodes({ at: prevPath })
      } else {
        this.mergeNodeAtPath(newPath)
      }
    })
  }

  /**
   * Merge the node at a path with the previous node.
   */

  mergeNodeAtPath(this: Editor, path: Path): void {
    if (path.length === 0) {
      throw new Error(`Cannot perform a merge on the top-level node.`)
    }

    if (path[path.length - 1] === 0) {
      throw new Error(
        `Cannot merge the node at path [${path}] with the previous sibling because there isn't one.`
      )
    }

    const { value } = this
    const prevPath = Path.previous(path)
    const node = Node.get(value, path)
    const prevNode = Node.get(value, prevPath)

    if (Text.isText(node) && Text.isText(prevNode)) {
      const { text, marks, ...properties } = node
      const position = prevNode.text.length
      this.apply({
        type: 'merge_node',
        path,
        position,
        target: null,
        properties,
      })
    } else if (Element.isElement(node) && Element.isElement(prevNode)) {
      const { nodes, ...properties } = node
      const position = prevNode.nodes.length
      this.apply({
        type: 'merge_node',
        path,
        position,
        target: null,
        properties,
      })
    } else {
      throw new Error(
        `Cannot merge the node at path [${path}] with the previous sibling because it is not the same kind: ${JSON.stringify(
          node
        )} ${JSON.stringify(prevNode)}`
      )
    }
  }

  /**
   * Wrap the node at a path in a new parent node.
   */

  wrapNodeAtPath(this: Editor, path: Path, element: Element): void {
    this.withoutNormalizing(() => {
      this.insertNodes(element, { at: path })
      const nextPath = Path.next(path)
      const childPath = path.concat(0)
      this.moveNodes({ at: nextPath, to: childPath })
    })
  }
}

export default PathCommands
