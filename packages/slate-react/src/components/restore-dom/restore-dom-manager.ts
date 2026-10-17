import { RefObject } from 'react'
import { ReactEditor } from '../../plugin/react-editor'
import { isDOMElement, isTrackedMutation } from 'slate-dom'

export type RestoreDOMManager = {
  registerMutations(mutations: MutationRecord[]): void
  restoreDOM(): void
  clear(): void
}

const isPlaceholderNode = (node: Node) =>
  isDOMElement(node) && node.hasAttribute('data-slate-placeholder')

const changesOnlyPlaceholders = ({
  addedNodes,
  removedNodes,
}: MutationRecord) => {
  const nodes = [...Array.from(addedNodes), ...Array.from(removedNodes)]
  return nodes.length > 0 && nodes.every(isPlaceholderNode)
}

export const createRestoreDomManager = (
  editor: ReactEditor,
  receivedUserInput: RefObject<boolean>
): RestoreDOMManager => {
  let bufferedMutations: MutationRecord[] = []

  const clear = () => {
    bufferedMutations = []
  }

  const registerMutations = (mutations: MutationRecord[]) => {
    if (!receivedUserInput.current) {
      return
    }

    const trackedMutations = mutations.filter(
      mutation =>
        !changesOnlyPlaceholders(mutation) &&
        isTrackedMutation(editor, mutation, mutations)
    )

    bufferedMutations.push(...trackedMutations)
  }

  function restoreDOM() {
    if (bufferedMutations.length > 0) {
      bufferedMutations.reverse().forEach(mutation => {
        if (mutation.type === 'characterData') {
          // We don't want to restore the DOM for characterData mutations
          // because this interrupts the composition.
          return
        }

        mutation.removedNodes.forEach(node => {
          mutation.target.insertBefore(node, mutation.nextSibling)
        })

        mutation.addedNodes.forEach(node => {
          mutation.target.removeChild(node)
        })
      })

      // Clear buffered mutations to ensure we don't undo them twice
      clear()
    }
  }

  return {
    registerMutations,
    restoreDOM,
    clear,
  }
}
