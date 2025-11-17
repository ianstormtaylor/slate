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
  editor: Editor,
  path: Path,
  f: (node: N) => N
) => {
  if (path.length === 0) {
    throw new Error('Cannot modify the editor')
  }

  const node = Node.get(editor, path) as N
  const slicedPath = path.slice()
  let modifiedNode: Node = f(node)

  while (slicedPath.length > 1) {
    const index = slicedPath.pop()!
    const ancestorNode = Node.get(editor, slicedPath) as Ancestor

    modifiedNode = {
      ...ancestorNode,
      children: replaceChildren(ancestorNode.children, index, 1, modifiedNode),
    }
  }

  const index = slicedPath.pop()!
  editor.children = replaceChildren(editor.children, index, 1, modifiedNode)
}

/**
 * Replace the children of a node, replacing all ancestors
 */
export const modifyChildren = (
  editor: Editor,
  path: Path,
  f: (children: Descendant[]) => Descendant[]
) => {
  if (path.length === 0) {
    editor.children = f(editor.children)
  } else {
    modifyDescendant<Element>(editor, path, node => {
      if (Text.isText(node)) {
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
  editor: Editor,
  path: Path,
  f: (leaf: Text) => Text
) =>
  modifyDescendant(editor, path, node => {
    if (!Text.isText(node)) {
      throw new Error(
        `Cannot get the leaf node at path [${path}] because it refers to a non-leaf node: ${Scrubber.stringify(
          node
        )}`
      )
    }

    return f(node)
  })
