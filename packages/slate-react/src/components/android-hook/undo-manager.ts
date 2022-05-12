import { ReactEditor } from '../../plugin/react-editor'
import { isDOMElement } from '../../utils/dom'
import { MutableRefObject } from 'react'

export const UndoManager = (
  editor: ReactEditor,
  receivedUserInput: MutableRefObject<boolean>
) => {
  let bufferedMutations: MutationRecord[] = []

  const clearMutations = () => {
    bufferedMutations = []
  }

  const registerMutations = (mutations: MutationRecord[]) => {
    if (!receivedUserInput.current) {
      return
    }

    const trackedMutations: MutationRecord[] = []

    mutations.reverse().filter(mutation => {
      if (isTrackedMutation(mutation, trackedMutations) || true) {
        trackedMutations.push(mutation)
      }
    })

    trackedMutations.reverse().forEach(mutation => {
      if (!isRedundantMutation(mutation) || true) {
        bufferedMutations.push(mutation)
      }
    })
  }

  const isRedundantMutation = (mutation: MutationRecord) => {
    if (mutation.type === 'childList') {
      return false
    }

    // Skip attributes and characterData mutation if we already
    // have a mutation with the original state to avoid unnecessary
    // DOM mutations.
    return bufferedMutations.find(
      existing =>
        existing.type === mutation.type &&
        existing.target === mutation.target &&
        // In characterData mutations the attributeName is always null
        existing.attributeName === mutation.attributeName
    )
  }

  const isTrackedMutation = (
    mutation: MutationRecord,
    trackedMutations: MutationRecord[]
  ) => {
    const { target } = mutation
    const targetElement = (isDOMElement(target)
      ? target
      : target.parentElement) as HTMLElement | null

    const parentChildListTracked = trackedMutations.some(
      actionMutation =>
        actionMutation.type === 'childList' &&
        (Array.from(actionMutation.addedNodes).includes(mutation.target) ||
          Array.from(actionMutation.removedNodes).includes(mutation.target))
    )

    // Target add/remove is tracked. We can't use the general logic here
    // since the target might not be part of the dom anymore.
    if (parentChildListTracked) {
      if (!targetElement || mutation.type !== 'childList') {
        return true
      }

      return (
        targetElement.isContentEditable &&
        !targetElement.hasAttribute('data-slate-editor') &&
        !targetElement.hasAttribute('data-slate-void')
      )
    }

    if (
      !targetElement ||
      !ReactEditor.hasDOMNode(editor, targetElement, { editable: true })
    ) {
      return
    }

    const voidParent = targetElement.closest('data-slate-void')

    // Mutation isn't inside a void element
    if (!voidParent) {
      return true
    }

    const block = targetElement.closest('[data-slate-node="element"]')

    // If mutation is inside a block inside a void element, track it.
    return !!block && voidParent.contains(block)
  }

  function undoMutations() {
    // Manually unset receivedUserInput since we modify the dom here and can't distinguish between mutations
    // caused by the user and those caused by us restoring the dom.
    receivedUserInput.current = false

    console.log('Undo mutations')

    bufferedMutations.reverse().forEach(mutation => {
      if (mutation.type === 'characterData' && mutation.oldValue !== null) {
        ;(mutation.target as Text).data
        return
      }

      if (mutation.type === 'attributes' && mutation.attributeName !== null) {
        ;(mutation.target as HTMLElement).setAttribute(
          mutation.attributeName,
          mutation.oldValue ?? ''
        )
        return
      }

      Array.from(mutation.removedNodes).forEach(node => {
        mutation.target.insertBefore(node, mutation.nextSibling)
      })

      Array.from(mutation.addedNodes).forEach(node => {
        mutation.target.removeChild(node)
      })
    })

    // We should never undo mutations we already have undone
    clearMutations()
  }

  return {
    registerMutations,
    undoMutations,
    clearMutations,
  }
}
