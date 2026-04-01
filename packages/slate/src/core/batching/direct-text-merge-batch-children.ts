import { Descendant, Element, Text } from '../..'
import { BaseMergeNodeOperation } from '../../interfaces/operation'
import { replaceChildren } from '../../utils/modify'

export const applyDirectTextMergeBatchToChildren = (
  children: Descendant[],
  ops: BaseMergeNodeOperation[]
) => {
  if (ops.length === 0) {
    return children
  }

  const nextChildren = children.slice()
  let hasChanges = false

  for (const op of ops) {
    const [parentIndex, textIndex] = op.path

    if (textIndex === 0) {
      throw new Error(
        `Cannot apply batched merge_node operations at path [${op.path}] because there is no previous sibling to merge.`
      )
    }

    const parent = nextChildren[parentIndex]

    if (!parent || !Element.isElement(parent)) {
      throw new Error(
        `Cannot apply batched merge_node operations because parent path [${parentIndex}] does not exist or is not an element.`
      )
    }

    const node = parent.children[textIndex]
    const prev = parent.children[textIndex - 1]

    if (!node || !prev || !Text.isText(node) || !Text.isText(prev)) {
      throw new Error(
        `Cannot apply batched merge_node operations at path [${op.path}] because the target and previous sibling are not text nodes.`
      )
    }

    const nextParent = {
      ...parent,
      children: replaceChildren(parent.children, textIndex - 1, 2, {
        ...prev,
        text: prev.text + node.text,
      }),
    }

    if (nextParent !== parent) {
      nextChildren[parentIndex] = nextParent
      hasChanges = true
    }
  }

  return hasChanges ? nextChildren : children
}
