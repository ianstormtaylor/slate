import { Editor, Path, Range } from 'slate'
import { ReactEditor } from '../..'
import { DOMNode, isDOMElement, isDOMText } from '../../utils/dom'
import { getTextInsertion, TextInsertion } from './diff-text'

interface MutationData {
  addedNodes: DOMNode[]
  removedNodes: DOMNode[]
  insertedText: TextInsertion[]
  characterDataMutations: MutationRecord[]
}

type MutationDetection = (editor: Editor, mutationData: MutationData) => boolean

export function gatherMutationData(
  editor: Editor,
  mutations: MutationRecord[],
  pendingInsertions: TextInsertion[] = []
): MutationData {
  const addedNodes: DOMNode[] = []
  const removedNodes: DOMNode[] = []
  let insertedText: TextInsertion[] = pendingInsertions.slice(0)
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

        const node = ReactEditor.toSlateNode(editor, parentNode)
        const textPath = ReactEditor.findPath(editor, node)

        // Filter out existing diffs for the current text node
        insertedText = insertedText.filter(
          ({ path }) => !Path.equals(path, textPath)
        )

        const textInsertion = getTextInsertion(editor, parentNode)
        if (!textInsertion) {
          return
        }

        // Add the text diff to the array of detected text insertions that need to be reconciled
        insertedText.push(textInsertion)
      }
    }
  })

  return { addedNodes, removedNodes, insertedText, characterDataMutations }
}

export const isLineBreak: MutationDetection = (
  editor,
  { addedNodes, removedNodes }
) => {
  const window = ReactEditor.getWindow(editor)

  const removesNodes = removedNodes.some(
    node => !window.document.contains(node)
  )
  if (removesNodes) {
    return false
  }

  return addedNodes.some(node => {
    // Inserted a plain line break
    if (isDOMText(node) && node.textContent === '\n') {
      return true
    }

    // Inserted a cloned slate node
    return (
      isDOMElement(node) &&
      (node.hasAttribute('data-slate-node') ||
        node.hasAttribute('data-slate-string') ||
        node.hasAttribute('data-slate-leaf'))
    )
  })
}

/**
 * So long as we check for all other kinds of mutations before deletion mutations,
 * we can safely assume that a set of mutations was a deletion if there are
 * removed nodes.
 */
export const isDeletion: MutationDetection = (
  _,
  { removedNodes, insertedText }
) => {
  return removedNodes.length > 0 && insertedText.length === 0
}

/**
 * If the selection was expanded and there are removed nodes,
 * the contents of the selection need to be replaced with the diff
 */
export const isReplaceExpandedSelection: MutationDetection = (
  editor,
  { removedNodes }
) => {
  const { selection } = editor
  return selection
    ? Range.isExpanded(Editor.unhangRange(editor, selection)) &&
        removedNodes.length > 0
    : false
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
