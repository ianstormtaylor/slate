import { Editor, Node, Path, Range } from 'slate'

import { DOMNode } from '../../utils/dom'
import { ReactEditor } from '../..'
import { TextInsertion, getTextInsertion } from './diff-text'

interface MutationData {
  addedNodes: DOMNode[]
  removedNodes: DOMNode[]
  insertedText: TextInsertion[]
  characterDataMutations: MutationRecord[]
}

type MutationDetection = (editor: Editor, mutationData: MutationData) => boolean

export function gatherMutationData(
  editor: Editor,
  mutations: MutationRecord[]
): MutationData {
  const addedNodes: DOMNode[] = []
  const removedNodes: DOMNode[] = []
  const insertedText: TextInsertion[] = []
  const characterDataMutations: MutationRecord[] = []

  mutations.forEach(mutation => {
    switch (mutation.type) {
      case 'childList': {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(addedNode => {
            addedNodes.push(addedNode)
          })
        }

        mutation.removedNodes.forEach(removedNode => {
          removedNodes.push(removedNode)
        })

        break
      }
      case 'characterData': {
        characterDataMutations.push(mutation)

        // Changes to text nodes should consider the parent element
        const { parentNode } = mutation.target

        if (!parentNode) {
          return
        }

        const textInsertion = getTextInsertion(editor, parentNode)

        if (!textInsertion) {
          return
        }

        // If we've already detected a diff at that path, we can return early
        if (
          insertedText.some(({ path }) => Path.equals(path, textInsertion.path))
        ) {
          return
        }

        // Add the text diff to the array of detected text insertions that need to be reconciled
        insertedText.push(textInsertion)
      }
    }
  })

  return { addedNodes, removedNodes, insertedText, characterDataMutations }
}

/**
 * In general, when a line break occurs, there will be more `addedNodes` than `removedNodes`.
 *
 * This isn't always the case however. In some cases, there will be more `removedNodes` than
 * `addedNodes`.
 *
 * To account for these edge cases, the most reliable strategy to detect line break mutations
 * is to check whether a new block was inserted of the same type as the current block.
 */
export const isLineBreak: MutationDetection = (editor, { addedNodes }) => {
  const { selection } = editor
  const parentNode = selection
    ? Node.parent(editor, selection.anchor.path)
    : null
  const parentDOMNode = parentNode
    ? ReactEditor.toDOMNode(editor, parentNode)
    : null

  if (!parentDOMNode) {
    return false
  }

  return addedNodes.some(
    addedNode =>
      addedNode instanceof HTMLElement &&
      addedNode.tagName === parentDOMNode?.tagName
  )
}

/**
 * So long as we check for line break mutations before deletion mutations,
 * we can safely assume that a set of mutations was a deletion if there are
 * removed nodes.
 */
export const isDeletion: MutationDetection = (_, { removedNodes }) => {
  return removedNodes.length > 0
}

/**
 * If the selection was expanded and there are removed nodes,
 * the contents of the selection need to be replaced with the diff
 */
export const isReplaceExpandedSelection: MutationDetection = (
  { selection },
  { removedNodes }
) => {
  return selection
    ? Range.isExpanded(selection) && removedNodes.length > 0
    : false
}

/**
 * Plain text insertion
 */
export const isTextInsertion: MutationDetection = (_, { insertedText }) => {
  return insertedText.length > 0
}

/**
 * Edge case. Detect mutations that remove leaf nodes and also update character data
 */
export const isRemoveLeafNodes: MutationDetection = (
  _,
  { addedNodes, characterDataMutations, removedNodes }
) => {
  return (
    removedNodes.length > 0 &&
    addedNodes.length === 0 &&
    characterDataMutations.length > 0
  )
}
