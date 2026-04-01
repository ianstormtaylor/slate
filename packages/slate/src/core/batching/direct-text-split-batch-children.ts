import { Descendant, Element, Text } from '../..'
import { BaseSplitNodeOperation } from '../../interfaces/operation'
import { replaceChildren } from '../../utils/modify'

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
    const [parentIndex, textIndex] = op.path
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
        {
          ...(op.properties as Partial<Text>),
          text: after,
        }
      ),
    }

    if (nextParent !== parent) {
      nextChildren[parentIndex] = nextParent
      hasChanges = true
    }
  }

  return hasChanges ? nextChildren : children
}
