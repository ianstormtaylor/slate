import {
  Ancestor,
  Descendant,
  Element,
  Node,
  Path,
  Scrubber,
  Text,
} from '../interfaces'

export const insertChildren = <T>(
  children: T[],
  index: number,
  ...newValues: T[]
) => {
  return replaceChildren(children, index, 0, ...newValues)
}

export const replaceChildren = <T>(
  children: T[],
  index: number,
  removeCount: number,
  ...newValues: T[]
) => {
  const out = children.slice()
  out.splice(index, removeCount, ...newValues)
  return out
}

export const replaceChild = <T>(children: T[], index: number, newValue: T) => {
  const out = children.slice()
  out[index] = newValue
  return out
}

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

  while (slicedPath.length > 1) {
    const index = slicedPath.pop()!
    const ancestorNode = Node.get(root, slicedPath) as Ancestor

    modifiedNode = {
      ...ancestorNode,
      children: replaceChild(ancestorNode.children, index, modifiedNode),
    }
  }

  const index = slicedPath[0]
  root.children = replaceChild(root.children, index, modifiedNode)
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
  } else {
    modifyDescendant<Element>(root, path, node => {
      if (Node.isText(node)) {
        throw new Error(
          `Cannot get the element at path [${path}] because it refers to a leaf node: ${Scrubber.stringify(
            node
          )}`
        )
      }

      return { ...node, children: f(node.children) }
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
