import { EditorInterface, Element, Editor, Text } from '../interfaces'

export const shouldMergeNodesRemovePrevNode: EditorInterface['shouldMergeNodesRemovePrevNode'] =
  (editor, [prevNode, prevPath], [curNode, curNodePath]) => {
    // If the target node that we're merging with is empty, remove it instead
    // of merging the two. This is a common rich text editor behavior to
    // prevent losing formatting when deleting entire nodes when you have a
    // hanging selection.
    // if prevNode is first child in parent,don't remove it.

    return (
      (Element.isElement(prevNode) && Editor.isEmpty(editor, prevNode)) ||
      (Text.isText(prevNode) &&
        prevNode.text === '' &&
        prevPath[prevPath.length - 1] !== 0)
    )
  }
