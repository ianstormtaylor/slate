import {
  Ancestor,
  Descendant,
  Editor,
  Element,
  Node,
  Path,
  Scrubber,
  Text,
} from '../interfaces'
import { MUTATED_CHILD_ARRAYS_IN_BATCH } from './weak-maps'

export const insertChildren = <T>(
  xs: T[],
  index: number,
  ...newValues: T[]
) => [...xs.slice(0, index), ...newValues, ...xs.slice(index)]

export const replaceChildren = <T>(
  xs: T[],
  index: number,
  removeCount: number,
  ...newValues: T[]
) => [...xs.slice(0, index), ...newValues, ...xs.slice(index + removeCount)]

export const removeChildren = replaceChildren

/**
 * Replace a descendant with a new node, replacing all ancestors
 */
export const modifyDescendant = <N extends Descendant>(
  root: Ancestor,
  path: Path,
  f: (node: N) => N
) => {
  if (path.length === 0) {
    throw new Error('Cannot modify the editor')
  }

  const node = Node.get(root, path) as N
  const slicedPath = path.slice()
  let modifiedNode: Node = f(node)

  const modifiedChildArrays = MUTATED_CHILD_ARRAYS_IN_BATCH.get(root as Editor)

  while (slicedPath.length > 1) {
    const index = slicedPath.pop()!
    const ancestorNode = Node.get(root, slicedPath) as Ancestor

    if (modifiedChildArrays?.has(ancestorNode.children)) {
      // we've already copied this array in this batch, don't worry about copying it again
      ancestorNode.children[index] = modifiedNode

      // this also means all ancestors are already copied, so we're done
      return
    } else {
      modifiedNode = {
        ...ancestorNode,
        children: replaceChildren(ancestorNode.children, index, 1,  modifiedNode),
      }
      if (modifiedChildArrays) {
        modifiedChildArrays.add(modifiedNode.children)
      }
    }
  }

  const index = slicedPath[0]

  if (modifiedChildArrays?.has(root.children)) {
    // we've already copied this array in this batch, don't worry about copying it again
    root.children[index] = modifiedNode
  } else {
    root.children = replaceChildren(root.children, index, 1, modifiedNode)
    if (modifiedChildArrays) {
      modifiedChildArrays.add(root.children)
    }
  }
}

/**
 * Replace the children of a node, replacing all ancestors
 */
export const modifyChildren = (
  root: Ancestor,
  path: Path,
  f: (children: Descendant[]) => Descendant[]
) => {
  if (path.length === 0) {
    root.children = f(root.children)
    MUTATED_CHILD_ARRAYS_IN_BATCH.get(root as Editor)?.add(root.children)
  } else {
    modifyDescendant<Element>(root, path, node => {
      if (Node.isText(node)) {
        throw new Error(
          `Cannot get the element at path [${path}] because it refers to a leaf node: ${Scrubber.stringify(
            node
          )}`
        )
      }

      const children = f(node.children)
      MUTATED_CHILD_ARRAYS_IN_BATCH.get(root as Editor)?.add(children)
      return { ...node, children }
    })
  }
}

/**
 * Replace a leaf, replacing all ancestors
 */
export const modifyLeaf = (
  root: Ancestor,
  path: Path,
  f: (leaf: Text) => Text
) =>
  modifyDescendant(root, path, node => {
    if (!Node.isText(node)) {
      throw new Error(
        `Cannot get the leaf node at path [${path}] because it refers to a non-leaf node: ${Scrubber.stringify(
          node
        )}`
      )
    }

    return f(node)
  })
