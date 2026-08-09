import { RefObject } from 'react'
import { ReactEditor } from '../../plugin/react-editor'
import { IS_COMPOSING, isTrackedMutation } from 'slate-dom'

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
    if (bufferedMutations.length > 0) {
      // The node the IME is currently composing in, if any. Restoring a
      // mutation that contains it removes the node out from under the
      // composition and cancels it, in the same way characterData mutations do
      // below. This happens when the first character is typed into an empty
      // leaf, where the browser adds a text node next to the leaf's `<br>`.
      let composingNode: Node | null = null

      if (IS_COMPOSING.get(editor)) {
        try {
          composingNode =
            ReactEditor.getWindow(editor).getSelection()?.anchorNode ?? null
        } catch {
          composingNode = null
        }
      }

      const containsComposingNode = (node: Node) =>
        !!composingNode &&
        (node === composingNode || node.contains(composingNode))

      bufferedMutations.reverse().forEach(mutation => {
        if (mutation.type === 'characterData') {
          // We don't want to restore the DOM for characterData mutations
          // because this interrupts the composition.
          return
        }

        if (
          containsComposingNode(mutation.target) ||
          Array.from(mutation.addedNodes).some(containsComposingNode)
        ) {
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
