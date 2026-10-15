import { Node } from 'slate'
import { NODE_TO_PARENT } from './weak-maps'

const INSERTED_NODES: WeakSet<Node> = new WeakSet()

const isNodeInUse = (node: Node): boolean =>
  NODE_TO_PARENT.has(node) ||
  INSERTED_NODES.has(node) ||
  (Node.isElement(node) && node.children.some(isNodeInUse))

const copyNode = <N extends Node>(node: N): N =>
  Node.isElement(node)
    ? { ...node, children: node.children.map(copyNode) }
    : { ...node }

const markInserted = (node: Node) => {
  INSERTED_NODES.add(node)

  if (Node.isElement(node)) {
    node.children.forEach(markInserted)
  }
}

export const copyNodeInUse = <N extends Node>(node: N): N => {
  const prepared = isNodeInUse(node) ? copyNode(node) : node
  markInserted(prepared)
  return prepared
}
