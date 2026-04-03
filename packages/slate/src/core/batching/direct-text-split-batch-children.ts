import { Descendant, Element, Node, Text } from '../..'
import { BaseSplitNodeOperation } from '../../interfaces/operation'
import { replaceChildren } from '../../utils/modify'
import { validateOperationPathIndexes } from './validate-operation-path'

export const applyDirectTextSplitBatchToChildren = (
  children: Descendant[],
  ops: BaseSplitNodeOperation[]
) => {
  if (ops.length === 0) {
    return children
  }

  const nextChildren = children.slice()
  let hasChanges = false

  for (const op of ops) {
    validateOperationPathIndexes(
      op.path,
      `Cannot apply batched split_node operations at path [${op.path}]`
    )

    const [parentIndex, textIndex] = op.path

    if (typeof op.position !== 'number') {
      throw new Error(
        `Cannot apply batched split_node operations at path [${op.path}] because the split position must be a number.`
      )
    }

    const parent = nextChildren[parentIndex]

    if (!parent || !Element.isElement(parent)) {
      throw new Error(
        `Cannot apply batched split_node operations because parent path [${parentIndex}] does not exist or is not an element.`
      )
    }

    const node = parent.children[textIndex]

    if (!node || !Text.isText(node)) {
      throw new Error(
        `Cannot apply batched split_node operations at path [${op.path}] because the target is not a text node.`
      )
    }

    const before = node.text.slice(0, op.position)
    const after = node.text.slice(op.position)
    const nextNode: Descendant = { text: after }
    const mutableNextNode = nextNode as unknown as Record<string, unknown>

    for (const key in op.properties) {
      if (key === 'children' || key === 'text') {
        throw new Error(`Cannot set the "${key}" property of nodes!`)
      }

      const value = op.properties[key as keyof Node]

      if (key === 'then' && typeof value === 'function') {
        throw new Error(
          'Cannot set the "then" property of a node to a function'
        )
      }

      if (value != null) {
        mutableNextNode[key] = value
      }
    }

    const nextParent = {
      ...parent,
      children: replaceChildren(
        parent.children,
        textIndex,
        1,
        {
          ...node,
          text: before,
        },
        nextNode
      ),
    }

    if (nextParent !== parent) {
      nextChildren[parentIndex] = nextParent
      hasChanges = true
    }
  }

  return hasChanges ? nextChildren : children
}
