import { Descendant, Element, Text } from '..'
import {
  BaseInsertTextOperation,
  BaseRemoveTextOperation,
} from '../interfaces/operation'

type TextBatchOperation = BaseInsertTextOperation | BaseRemoveTextOperation

type BatchTreeNode = {
  children: Map<number, BatchTreeNode>
  ops?: TextBatchOperation[]
}

const createBatchTreeNode = (): BatchTreeNode => ({
  children: new Map(),
})

const applyTextOperation = (node: Text, op: TextBatchOperation): Text => {
  if (op.type === 'insert_text') {
    if (op.text.length === 0) {
      return node
    }

    const before = node.text.slice(0, op.offset)
    const after = node.text.slice(op.offset)
    const text = before + op.text + after

    return text === node.text ? node : { ...node, text }
  }

  if (op.text.length === 0) {
    return node
  }

  const before = node.text.slice(0, op.offset)
  const after = node.text.slice(op.offset + op.text.length)
  const text = before + after

  return text === node.text ? node : { ...node, text }
}

const applyBatchToNode = (
  node: Descendant,
  branch: BatchTreeNode
): Descendant => {
  let nextNode = node

  if (branch.children.size > 0) {
    if (!Element.isElement(node)) {
      throw new Error(
        `Cannot apply batched text operations beneath non-element node at operation path [${
          branch.ops?.[branch.ops.length - 1]?.path ?? ''
        }]`
      )
    }

    const nextChildren = node.children.slice()
    let hasChildChanges = false

    for (const [index, childBranch] of branch.children) {
      const child = node.children[index]

      if (!child) {
        throw new Error(
          `Cannot apply batched text operations because path [${index}] does not exist in the current branch.`
        )
      }

      const nextChild = applyBatchToNode(child, childBranch)

      if (nextChild !== child) {
        nextChildren[index] = nextChild
        hasChildChanges = true
      }
    }

    if (hasChildChanges) {
      nextNode = {
        ...nextNode,
        children: nextChildren,
      }
    }
  }

  if (branch.ops) {
    if (!Text.isText(nextNode)) {
      throw new Error(
        `Cannot apply batched text operations to non-text node at path [${
          branch.ops[branch.ops.length - 1]?.path ?? ''
        }]`
      )
    }

    let nextLeaf = nextNode

    for (const op of branch.ops) {
      nextLeaf = applyTextOperation(nextLeaf, op)
    }

    nextNode = nextLeaf
  }

  return nextNode
}

export const applyTextBatchToChildren = (
  children: Descendant[],
  ops: TextBatchOperation[]
) => {
  if (ops.length === 0) {
    return children
  }

  const root = createBatchTreeNode()

  for (const op of ops) {
    let branch = root

    for (const index of op.path) {
      let child = branch.children.get(index)

      if (!child) {
        child = createBatchTreeNode()
        branch.children.set(index, child)
      }

      branch = child
    }

    branch.ops = branch.ops ? [...branch.ops, op] : [op]
  }

  const nextChildren = children.slice()
  let hasChanges = false

  for (const [index, branch] of root.children) {
    const child = children[index]

    if (!child) {
      throw new Error(
        `Cannot apply batched text operations because top-level path [${index}] does not exist.`
      )
    }

    const nextChild = applyBatchToNode(child, branch)

    if (nextChild !== child) {
      nextChildren[index] = nextChild
      hasChanges = true
    }
  }

  return hasChanges ? nextChildren : children
}
