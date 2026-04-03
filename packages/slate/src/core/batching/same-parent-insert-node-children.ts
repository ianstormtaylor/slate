import { Descendant, Element, Path } from '../..'
import { BaseInsertNodeOperation } from '../../interfaces/operation'
import { validateOperationPathIndexes } from './validate-operation-path'

const getParentPath = (op: BaseInsertNodeOperation) => Path.parent(op.path)

class FenwickTree {
  tree: number[]

  constructor(size: number) {
    this.tree = new Array(size + 1).fill(0)

    for (let index = 1; index <= size; index++) {
      this.add(index, 1)
    }
  }

  add(index: number, value: number) {
    for (let next = index; next < this.tree.length; next += next & -next) {
      this.tree[next] += value
    }
  }

  findByOrder(order: number) {
    let index = 0
    let bit = 1

    while (bit << 1 < this.tree.length) {
      bit <<= 1
    }

    for (; bit !== 0; bit >>= 1) {
      const next = index + bit

      if (next < this.tree.length && this.tree[next] < order) {
        index = next
        order -= this.tree[next]
      }
    }

    return index
  }
}

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
    const nextChildren = new Array(parentChildren.length + ops.length)
    const freeSlots = new FenwickTree(nextChildren.length)

    for (let index = ops.length - 1; index >= 0; index--) {
      const op = ops[index]

      validateOperationPathIndexes(
        op.path,
        `Cannot apply batched insert_node operations at path [${op.path}]`
      )

      const childIndex = op.path[op.path.length - 1]
      const order = childIndex + 1
      const availableSlots = parentChildren.length + index + 1

      if (order > availableSlots) {
        throw new Error(
          `Cannot apply an "insert_node" operation at path [${op.path}] because the destination is past the end of the node.`
        )
      }

      const slot = freeSlots.findByOrder(order)
      nextChildren[slot] = op.node
      freeSlots.add(slot + 1, -1)
    }

    let parentIndex = 0

    for (let index = 0; index < nextChildren.length; index++) {
      if (nextChildren[index] === undefined) {
        nextChildren[index] = parentChildren[parentIndex]
        parentIndex++
      }
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
