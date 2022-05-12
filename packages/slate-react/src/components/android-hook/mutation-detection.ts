import { Editor, Node, Path, Range } from 'slate'

import { DOMNode, isDOMElement, isDOMText } from '../../utils/dom'
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
        node.hasAttribute('data-slate-string'))
    )
  })
}

// Swift key first element in the line does some weird stuff
export const isUnwrapNode: MutationDetection = (
  _,
  { removedNodes, addedNodes, characterDataMutations }
) => {
  if (characterDataMutations.length > 0 || removedNodes.length === 0) {
    return false
  }

  return removedNodes.every(node => {
    if (!isDOMElement(node)) {
      return !addedNodes.some(added => added === node || added.contains(node))
    }

    for (const child of node.children) {
      if (!removedNodes.includes(child) && !addedNodes.includes(child)) {
        return false
      }
    }

    return true
  })
}

/**
 * So long as we check for all other kinds of mutations before deletion mutations,
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
export const isTextInsertion: MutationDetection = (
  _,
  { insertedText, addedNodes }
) => {
  return insertedText.length > 0
}

/**
 * Edge case. Detect mutations that remove leaf nodes and also update character data
 */
export const isRemoveLeafNodes: MutationDetection = (
  _,
  { addedNodes, characterDataMutations, removedNodes }
) => {
  console.log(addedNodes, removedNodes, characterDataMutations)

  return (
    removedNodes.length > 0 &&
    addedNodes.length === 0 &&
    characterDataMutations.length > 0
  )
}
