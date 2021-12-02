import React, { useCallback, useEffect, useRef } from 'react'
import { Node as SlateNode, Path } from 'slate'
import { ReactEditor, useSlateStatic } from '../..'
import { DOMNode, isDOMElement } from '../../utils/dom'
import { ELEMENT_TO_NODE, NODE_TO_RESTORE_DOM } from '../../utils/weak-maps'
import { useMutationObserver } from './use-mutation-observer'

const MUTATION_OBSERVER_CONFIG: MutationObserverInit = {
  childList: true,
  characterData: true,
  subtree: true,
}

function findClosestKnowSlateNode(domNode: DOMNode): SlateNode | null {
  let domEl = isDOMElement(domNode) ? domNode : domNode.parentElement

  if (domEl && !domEl.hasAttribute('data-slate-node')) {
    domEl = domEl.closest(`[data-slate-node]`)
  }

  const slateNode = domEl && ELEMENT_TO_NODE.get(domEl as HTMLElement)
  if (slateNode) {
    return slateNode
  }

  // Unknown dom element with a slate-slate-node attribute => the IME
  // most likely duplicated the node so we have to restore the parent
  return domEl?.parentElement
    ? findClosestKnowSlateNode(domEl.parentElement)
    : null
}

export function useRestoreDom(
  node: React.RefObject<HTMLElement>,
  receivedUserInput: React.RefObject<boolean>
) {
  const editor = useSlateStatic()
  const mutatedNodes = useRef<Set<SlateNode>>(new Set())

  const handleDOMMutation = useCallback((mutations: MutationRecord[]) => {
    if (!receivedUserInput.current) {
      return
    }

    mutations.forEach(({ target }) => {
      const slateNode = findClosestKnowSlateNode(target)
      if (!slateNode) {
        return
      }

      return mutatedNodes.current.add(slateNode)
    })
  }, [])

  useMutationObserver(node, handleDOMMutation, MUTATION_OBSERVER_CONFIG)

  useEffect(() => {
    // Clear mutated nodes on every render
    mutatedNodes.current.clear()
  })

  const restore = useCallback(() => {
    const mutated = Array.from(mutatedNodes.current.values())

    // Filter out child nodes of nodes that will be restored anyway
    const nodesToRestore = mutated.filter(
      n =>
        !mutated.some(m =>
          Path.isParent(
            ReactEditor.findPath(editor, m),
            ReactEditor.findPath(editor, n)
          )
        )
    )

    nodesToRestore.forEach(n => {
      // Force node to re-render
      NODE_TO_RESTORE_DOM.get(n)?.()
    })
  }, [])

  return restore
}
