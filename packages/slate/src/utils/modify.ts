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

export const smartInsertChildren = <T extends Descendant>(
  modifiedChildArrays: WeakSet<Descendant[]> | undefined,
  children: T[],
  index: number,
  ...newValues: T[]
) => {
  return smartReplaceChildren(
    modifiedChildArrays,
    children,
    index,
    0,
    ...newValues
  )
}

export const smartReplaceChildren = <T extends Descendant>(
  modifiedChildArrays: WeakSet<Descendant[]> | undefined,
  children: T[],
  index: number,
  removeCount: number,
  ...newValues: T[]
) => {
  let out
  if (modifiedChildArrays?.has(children)) {
    out = children
  } else {
    out = children.slice()
    modifiedChildArrays?.add(out)
  }
  out.splice(index, removeCount, ...newValues)
  return out
}

export const smartReplaceChild = <T extends Descendant>(
  modifiedChildArrays: WeakSet<Descendant[]> | undefined,
  children: T[],
  index: number,
  newValue: T
) => {
  let out
  if (modifiedChildArrays?.has(children)) {
    out = children
  } else {
    out = children.slice()
    modifiedChildArrays?.add(out)
  }
  out[index] = newValue
  return out
}

export const smartRemoveChildren = smartReplaceChildren

/**
 * Replace a descendant with a new node, replacing all ancestors
 */
export const modifyDescendant = <N extends Descendant>(
  root: Ancestor,
  path: Path,
  f: (node: N, mutatedChildArrays?: WeakSet<Descendant[]>) => N
) => {
  if (path.length === 0) {
    throw new Error('Cannot modify the editor')
  }

  const node = Node.get(root, path) as N
  const mutatedChildArrays = MUTATED_CHILD_ARRAYS_IN_BATCH.get(root as Editor)
  let modifiedNode: Node = f(node, mutatedChildArrays)
  if (modifiedNode === node) return

  const slicedPath = path.slice()

  while (slicedPath.length > 1) {
    const index = slicedPath.pop()!
    const ancestorNode = Node.get(root, slicedPath) as Ancestor

    const children = smartReplaceChild(
      mutatedChildArrays,
      ancestorNode.children,
      index,
      modifiedNode
    )

    if (children === ancestorNode.children) {
      // we were able to directly mutate, no further replacements needed
      return
    }

    modifiedNode = {
      ...ancestorNode,
      children,
    }
  }

  const index = slicedPath[0]

  root.children = smartReplaceChild(
    mutatedChildArrays,
    root.children,
    index,
    modifiedNode
  )
}

/**
 * Replace the children of a node, replacing all ancestors
 */
export const modifyChildren = (
  root: Ancestor,
  path: Path,
  f: (
    children: Descendant[],
    mutatedChildArrays?: WeakSet<Descendant[]>
  ) => Descendant[]
) => {
  if (path.length === 0) {
    const mutatedChildArrays = MUTATED_CHILD_ARRAYS_IN_BATCH.get(root as Editor)
    root.children = f(root.children, mutatedChildArrays)
  } else {
    modifyDescendant<Element>(root, path, (node, mutatedChildArrays) => {
      if (Node.isText(node)) {
        throw new Error(
          `Cannot get the element at path [${path}] because it refers to a leaf node: ${Scrubber.stringify(
            node
          )}`
        )
      }

      const children = f(node.children, mutatedChildArrays)
      return children === node.children ? node : { ...node, children }
    })
  }
}

/**
 * Replace a leaf, replacing all ancestors
 */
export const modifyLeaf = (
  root: Ancestor,
  path: Path,
  f: (leaf: Text, mutatedChildArrays?: WeakSet<Descendant[]>) => Text
) =>
  modifyDescendant(root, path, (node, mutatedChildArrays) => {
    if (!Node.isText(node)) {
      throw new Error(
        `Cannot get the leaf node at path [${path}] because it refers to a non-leaf node: ${Scrubber.stringify(
          node
        )}`
      )
    }

    return f(node, mutatedChildArrays)
  })
