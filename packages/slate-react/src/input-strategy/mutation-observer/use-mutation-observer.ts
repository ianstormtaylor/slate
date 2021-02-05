import { useCallback, useRef, useState } from 'react'
import { Text, Transforms } from 'slate'

import { ReactEditor } from '../../plugin/react-editor'
import { useSlate } from '../../hooks/use-slate'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import { InputStrategy } from '../types'

import { diffText } from './diff-text'

const MUTATION_OBSERVER_CONFIG: MutationObserverInit = {
  childList: true,
  characterData: true,
  attributes: true,
  subtree: true,
  characterDataOldValue: true,
}

export const useMutationObserverStrategy: InputStrategy = ({ nodeRef }) => {
  const editor = useSlate()
  const handleMutations = useCallback((mutations: MutationRecord[]) => {
    if (mutations.length === 0) {
      return
    }

    const mutation = mutations[0]

    if (mutation.type === 'characterData') {
      const domNode = mutation.target.parentNode!
      const node = ReactEditor.toSlateNode(editor, domNode) as Text
      const prevText = node.text
      let nextText = domNode.textContent!

      // textContent will pad an extra \n when the textContent ends with an \n
      if (nextText.endsWith('\n')) {
        nextText = nextText.slice(0, nextText.length - 1)
      }

      // If the text is no different, there is no diff.
      if (nextText !== prevText) {
        const textDiff = diffText(prevText, nextText)
        if (textDiff !== null) {
          const path = ReactEditor.findPath(editor, node)
          Transforms.insertText(editor, textDiff.insertText, {
            at: {
              anchor: { path, offset: textDiff.start },
              focus: { path, offset: textDiff.end },
            },
          })
        }
      }
    }
  }, [])
  const [mutationObserver] = useState(
    () => new MutationObserver(handleMutations)
  )
  const isComposingRef = useRef(false)

  useIsomorphicLayoutEffect(() => {
    if (!nodeRef.current) {
      throw new Error('Editor root node is not present')
    }

    mutationObserver.observe(nodeRef.current, MUTATION_OBSERVER_CONFIG)

    return () => mutationObserver.disconnect()
  }, [])

  return {
    attributes: {},
    isComposing: isComposingRef,
  }
}
