import { Descendant, Node } from '../..'
import { BaseSetNodeOperation } from '../../interfaces/operation'
import { validateOperationPathIndexes } from './validate-operation-path'

type BatchTreeNode = {
  children: Map<number, BatchTreeNode>
  ops?: BaseSetNodeOperation[]
}

const createBatchTreeNode = (): BatchTreeNode => ({
  children: new Map(),
})

export const validateExactSetNodeOperation = (op: BaseSetNodeOperation) => {
  if (op.path.length === 0) {
    throw new Error('Cannot set properties on the root node!')
  }

  validateOperationPathIndexes(
    op.path,
    `Cannot apply batched set_node operations at path [${op.path}]`
  )

  for (const key in op.newProperties) {
    if (key === 'children' || key === 'text') {
      throw new Error(`Cannot set the "${key}" property of nodes!`)
    }
  }
}

const applySetNodeOperation = (node: Node, op: BaseSetNodeOperation): Node => {
  const { properties, newProperties } = op
  const nextNode = { ...node }
  const mutableNode = nextNode as Record<string, unknown>

  validateExactSetNodeOperation(op)

  for (const key in newProperties) {
    const value = newProperties[key as keyof Node]

    if (key === 'then' && typeof value === 'function') {
      throw new Error('Cannot set the "then" property of a node to a function')
    }

    if (value == null) {
      delete mutableNode[key]
    } else {
      mutableNode[key] = value
    }
  }

  for (const key in properties) {
    if (!Object.hasOwn(newProperties, key)) {
      delete mutableNode[key]
    }
  }

  return nextNode
}

const applyBatchToNode = (node: Node, branch: BatchTreeNode): Node => {
  let nextNode = node

  if (branch.children.size > 0) {
    if (!Node.isElement(node)) {
      throw new Error(
        `Cannot apply batched node updates beneath non-element node at operation path [${
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
          `Cannot apply batched set_node operations because path [${index}] does not exist in the current branch.`
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
      } as Node
    }
  }

  if (branch.ops) {
    for (const op of branch.ops) {
      nextNode = applySetNodeOperation(nextNode, op)
    }
  }

  return nextNode
}

export const applySetNodeBatchToChildren = (
  children: Descendant[],
  ops: BaseSetNodeOperation[]
) => {
  if (ops.length === 0) {
    return children
  }

  const root = createBatchTreeNode()

  for (const op of ops) {
    validateExactSetNodeOperation(op)

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
        `Cannot apply batched set_node operations because top-level path [${index}] does not exist.`
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
