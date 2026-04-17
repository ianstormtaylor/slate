import { Descendant, Element, Path } from '../..'
import { BaseInsertNodeOperation } from '../../interfaces/operation'
import { validateOperationPathIndexes } from './validate-operation-path'

const getParentPath = (op: BaseInsertNodeOperation) => Path.parent(op.path)

export const canApplyInsertNodeBatchToChildren = (
  ops: BaseInsertNodeOperation[]
) => {
  if (ops.length === 0) {
    return false
  }

  const parentPath = getParentPath(ops[0])

  return ops.every(op => Path.equals(getParentPath(op), parentPath))
}

export const applyInsertNodeBatchToChildren = (
  children: Descendant[],
  ops: BaseInsertNodeOperation[]
) => {
  if (ops.length === 0) {
    return children
  }

  if (!canApplyInsertNodeBatchToChildren(ops)) {
    throw new Error(
      'Cannot apply batched insert_node operations because they do not target the same parent path.'
    )
  }

  const buildInsertedChildren = (parentChildren: Descendant[]) => {
    const nextChildren = parentChildren.slice()

    for (const op of ops) {
      const childIndex = op.path[op.path.length - 1]

      validateOperationPathIndexes(
        op.path,
        `Cannot apply batched insert_node operations at path [${op.path}]`
      )

      if (childIndex > nextChildren.length) {
        throw new Error(
          `Cannot apply an "insert_node" operation at path [${op.path}] because the destination is past the end of the node.`
        )
      }

      nextChildren.splice(childIndex, 0, op.node)
    }

    return nextChildren
  }

  const parentPath = getParentPath(ops[0])

  if (parentPath.length === 0) {
    return buildInsertedChildren(children)
  }

  const nextChildren = children.slice()
  let draftChildren = nextChildren
  let originalChildren = children

  for (let depth = 0; depth < parentPath.length; depth++) {
    const index = parentPath[depth]
    const originalNode = originalChildren[index]

    if (!originalNode) {
      throw new Error(
        `Cannot apply batched insert_node operations because parent path [${parentPath}] does not exist.`
      )
    }

    if (!Element.isElement(originalNode)) {
      throw new Error(
        `Cannot apply batched insert_node operations beneath non-element node at path [${parentPath}].`
      )
    }

    const draftNode = {
      ...originalNode,
      children:
        depth === parentPath.length - 1
          ? buildInsertedChildren(originalNode.children)
          : originalNode.children.slice(),
    }

    draftChildren[index] = draftNode
    originalChildren = originalNode.children
    draftChildren = draftNode.children
  }

  return nextChildren
}
