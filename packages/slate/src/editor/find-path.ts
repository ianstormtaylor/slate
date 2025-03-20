import { Text } from '../interfaces/text'
import { BaseEditor, EditorInterface } from '../interfaces/editor'
import { Ancestor } from '../interfaces/node'
import { Scrubber } from '../interfaces/scrubber'

export const findPath: EditorInterface['findPath'] = (editor, node) => {
  if (node === editor) {
    return []
  }

  const nodeToParent = getNodeToParent(editor)

  const parent = nodeToParent.get(node)
  if (!parent) {
    throw new Error(
      `Unable to find the path for Slate node (parent not found): ${Scrubber.stringify(
        node
      )}`
    )
  }

  const parentPath = findPath(editor, parent)

  const index = parent.children.indexOf(node)
  if (index < 0) {
    throw new Error(
      `Unable to find the path for Slate node (node is not child of its parent): ${Scrubber.stringify(
        node
      )}`
    )
  }

  return [...parentPath, index]
}

export function getNodeToParent(editor: BaseEditor) {
  let nodeToParent = editor._caches.nodeToParent
  if (nodeToParent) {
    return nodeToParent
  }

  nodeToParent = new WeakMap()
  editor._caches.nodeToParent = nodeToParent
  const parents: Ancestor[] = [editor]

  let parent = parents.pop()
  while (parent) {
    for (const child of parent.children) {
      nodeToParent.set(child, parent)
      if (!Text.isText(child)) {
        parents.push(child)
      }
    }
    parent = parents.pop()
  }

  return nodeToParent
}
