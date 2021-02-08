import { useCallback, useRef, useState } from 'react'
import { Editor, Path, Range, Text, Transforms } from 'slate'

import { ReactEditor } from '../../plugin/react-editor'
import { useSlate } from '../../hooks/use-slate'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import { InputStrategy } from '../types'

import { diffText, getInsertedText, InsertedText } from './diff-text'
import { useTrackUserInput } from './use-track-user-input'
import { useRestoreDOM } from './use-restore-dom'

const MUTATION_OBSERVER_CONFIG: MutationObserverInit = {
  childList: true,
  characterData: true,
  characterDataOldValue: true,
  subtree: true,
}

export const useMutationObserverStrategy: InputStrategy = ({ nodeRef }) => {
  const editor = useSlate()
  const isComposing = useRef(false)
  const {
    userInput,
    attributes: trackUserInputAttributes,
  } = useTrackUserInput()
  const { restoreDOM, attributes: restoreDOMAttributes } = useRestoreDOM()

  const handleMutations = useCallback((mutations: MutationRecord[]) => {
    if (!userInput.current || mutations.length === 0) {
      return
    }

    const { selection } = editor
    const addedNodes: Node[] = []
    const removedNodes: Node[] = []
    const insertedText: InsertedText[] = []
    let shouldRestoreDOM = true
    let insertLineBreakMutation = false

    mutations.forEach(mutation => {
      switch (mutation.type) {
        case 'childList': {
          if (mutation.addedNodes.length) {
            if (mutation.target === nodeRef.current) {
              // Detected line break insertion mutation
              insertLineBreakMutation = true
              break
            }

            mutation.addedNodes.forEach(addedNode => {
              if (
                addedNodes.includes(addedNode) ||
                addedNodes.some(node => node.contains(addedNode))
              ) {
                return
              }

              addedNodes.push(addedNode)
            })
          }

          mutation.removedNodes.forEach(removedNode => {
            if (
              removedNodes.includes(removedNode) ||
              removedNodes.some(node => node.contains(removedNode))
            ) {
              return
            }

            removedNodes.push(removedNode)
          })

          break
        }
        case 'characterData': {
          // Changes to text nodes should consider the parent element
          const { parentNode } = mutation.target

          if (!parentNode) {
            return
          }

          const node = ReactEditor.toSlateNode(editor, parentNode) as Text
          const prevText = node.text
          let nextText = parentNode.textContent!

          // textContent will pad an extra \n when the textContent ends with an \n
          if (nextText.endsWith('\n')) {
            nextText = nextText.slice(0, nextText.length - 1)
          }

          // If the text is no different, there is no diff.
          if (nextText !== prevText) {
            const textDiff = diffText(prevText, nextText)
            if (textDiff !== null) {
              const textPath = ReactEditor.findPath(editor, node)

              if (
                insertedText.some(({ path }) => Path.equals(path, textPath))
              ) {
                return
              }

              insertedText.push({ text: textDiff, path: textPath })
            }
          }
        }
      }
    })

    if (selection && Range.isExpanded(selection) && removedNodes.length) {
      // Delete expanded selection
      Editor.deleteFragment(editor)

      const text = getInsertedText(insertedText)
      if (text.length) {
        // Selection was replaced by text
        Editor.insertText(editor, text)
      }
    } else if (insertLineBreakMutation) {
      // Insert line break
      Editor.insertBreak(editor)
      isComposing.current = false
    } else if (removedNodes.length) {
      // Delete contents backwards
      Editor.deleteBackward(editor)
    } else if (insertedText.length) {
      // Insert text
      insertedText.forEach(({ text, path }) =>
        Transforms.insertText(editor, text.insertText, {
          at: {
            anchor: { path, offset: text.start },
            focus: { path, offset: text.end },
          },
        })
      )

      shouldRestoreDOM = false
    }

    if (shouldRestoreDOM) {
      // When the Slate document gets out of sync with the DOM, we need to
      // force restore the DOM by incementing the `key` prop on the Editor
      // This approach is expensive, in the future, perhaps only certain
      // portions sof the document could be restored
      restoreDOM()
    }
  }, [])
  const [mutationObserver] = useState(
    () => new MutationObserver(handleMutations)
  )

  useIsomorphicLayoutEffect(() => {
    if (!nodeRef.current) {
      throw new Error('Editor root node is not present')
    }

    // Attach mutation observer to the editor's root node
    mutationObserver.observe(nodeRef.current, MUTATION_OBSERVER_CONFIG)

    return () => mutationObserver.disconnect()
  })

  return {
    attributes: {
      ...restoreDOMAttributes,
      ...trackUserInputAttributes,
    },
    isComposing,
  }
}

