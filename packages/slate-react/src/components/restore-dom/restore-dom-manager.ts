import { RefObject } from 'react'
import { ReactEditor } from '../../plugin/react-editor'
import { isTrackedMutation } from '../../utils/dom'

export type RestoreDOMManager = {
  registerMutations: (mutations: MutationRecord[]) => void
  restoreDOM: () => void
  clear: () => void
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

    const trackedMutations = mutations.filter(mutation =>
      isTrackedMutation(editor, mutation, mutations)
    )

    bufferedMutations.push(...trackedMutations)
  }

  function restoreDOM() {
    bufferedMutations.reverse().forEach(mutation => {
      if (mutation.type === 'characterData') {
        mutation.target.textContent = mutation.oldValue
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

  return {
    registerMutations,
    restoreDOM,
    clear,
  }
}
