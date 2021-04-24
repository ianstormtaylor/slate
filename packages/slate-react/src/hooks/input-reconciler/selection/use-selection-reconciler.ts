import { useCallback, useRef } from 'react'
import { Editor, Range, Transforms } from 'slate'
import throttle from 'lodash/throttle'
import scrollIntoView from 'scroll-into-view-if-needed'

import { ReconcilerArguments } from '../types'
import { ReactEditor } from '../../..'
import { useIsomorphicLayoutEffect } from '../../use-isomorphic-layout-effect'
import { IS_FIREFOX } from '../../../utils/environment'
import { EDITOR_TO_ELEMENT, IS_FOCUSED } from '../../../utils/weak-maps'
import { hasTarget, hasEditableTarget } from '../../../utils/helpers'

interface Arguments extends ReconcilerArguments {}

export function useSelectionReconciler({
  context,
  editor,
  readOnly,
}: Arguments) {
  // Listen on the native `selectionchange` event to be able to update any time
  // the selection changes. This is required because React's `onSelect` is leaky
  // and non-standard so it doesn't fire until after a selection has been
  // released. This causes issues in situations where another change happens
  // while a selection is being dragged.
  const onDOMSelectionChange = useCallback(
    throttle(() => {
      const {
        composition: { isComposing },
        selection,
      } = context.current

      if (!readOnly && !isComposing && !selection.isUpdating) {
        const root = ReactEditor.findDocumentOrShadowRoot(editor)
        const { activeElement } = root
        const el = ReactEditor.toDOMNode(editor, editor)
        const domSelection = root.getSelection()

        if (activeElement === el) {
          context.current.latestElement = activeElement
          IS_FOCUSED.set(editor, true)
        } else {
          IS_FOCUSED.delete(editor)
        }

        if (!domSelection) {
          return Transforms.deselect(editor)
        }

        const { anchorNode, focusNode } = domSelection

        const anchorNodeSelectable =
          hasEditableTarget(editor, anchorNode) ||
          isTargetInsideVoid(editor, anchorNode)

        const focusNodeSelectable =
          hasEditableTarget(editor, focusNode) ||
          isTargetInsideVoid(editor, focusNode)

        if (anchorNodeSelectable && focusNodeSelectable) {
          const range = ReactEditor.toSlateRange(editor, domSelection, {
            exactMatch: false,
          })
          Transforms.select(editor, range)
        } else {
          Transforms.deselect(editor)
        }
      }
    }, 100),
    [readOnly]
  )

  // Attach a native DOM event handler for `selectionchange`, because React's
  // built-in `onSelect` handler doesn't fire for all selection changes. It's a
  // leaky polyfill that only fires on keypresses or clicks. Instead, we want to
  // fire for any change to the selection inside the editor. (2019/11/04)
  // https://github.com/facebook/react/issues/5785
  useIsomorphicLayoutEffect(() => {
    const window = ReactEditor.getWindow(editor)
    window.document.addEventListener('selectionchange', onDOMSelectionChange)

    return () => {
      window.document.removeEventListener(
        'selectionchange',
        onDOMSelectionChange
      )
    }
  }, [onDOMSelectionChange])

  // Whenever the editor updates, make sure the DOM selection state is in sync.
  useIsomorphicLayoutEffect(() => {
    const { selection } = editor
    const {
      composition: { isComposing },
    } = context.current
    const root = ReactEditor.findDocumentOrShadowRoot(editor)
    const domSelection = root.getSelection()

    if (isComposing || !domSelection || !ReactEditor.isFocused(editor)) {
      return
    }

    const hasDomSelection = domSelection.type !== 'None'

    // If the DOM selection is properly unset, we're done.
    if (!selection && !hasDomSelection) {
      return
    }

    // verify that the dom selection is in the editor
    const editorElement = EDITOR_TO_ELEMENT.get(editor)!
    let hasDomSelectionInEditor = false
    if (
      editorElement.contains(domSelection.anchorNode) &&
      editorElement.contains(domSelection.focusNode)
    ) {
      hasDomSelectionInEditor = true
    }

    // If the DOM selection is in the editor and the editor selection is already correct, we're done.
    if (hasDomSelection && hasDomSelectionInEditor && selection) {
      const slateRange = ReactEditor.toSlateRange(editor, domSelection, {
        exactMatch: true,
      })
      if (slateRange && Range.equals(slateRange, selection)) {
        return
      }
    }

    // when <Editable/> is being controlled through external value
    // then its children might just change - DOM responds to it on its own
    // but Slate's value is not being updated through any operation
    // and thus it doesn't transform selection on its own
    if (selection && !ReactEditor.hasRange(editor, selection)) {
      editor.selection = ReactEditor.toSlateRange(editor, domSelection, {
        exactMatch: false,
      })
      return
    }

    // Otherwise the DOM selection is out of sync, so update it.
    const el = ReactEditor.toDOMNode(editor, editor)
    context.current.selection.isUpdating = true

    const newDomRange = selection && ReactEditor.toDOMRange(editor, selection)

    if (newDomRange) {
      if (Range.isBackward(selection!)) {
        domSelection.setBaseAndExtent(
          newDomRange.endContainer,
          newDomRange.endOffset,
          newDomRange.startContainer,
          newDomRange.startOffset
        )
      } else {
        domSelection.setBaseAndExtent(
          newDomRange.startContainer,
          newDomRange.startOffset,
          newDomRange.endContainer,
          newDomRange.endOffset
        )
      }
      const leafEl = newDomRange.startContainer.parentElement!
      leafEl.getBoundingClientRect = newDomRange.getBoundingClientRect.bind(
        newDomRange
      )
      scrollIntoView(leafEl, {
        scrollMode: 'if-needed',
        boundary: el,
      })
      // @ts-ignore
      delete leafEl.getBoundingClientRect
    } else {
      domSelection.removeAllRanges()
    }

    setTimeout(() => {
      // COMPAT: In Firefox, it's not enough to create a range, you also need
      // to focus the contenteditable element too. (2016/11/16)
      if (newDomRange && IS_FIREFOX) {
        el.focus()
      }

      context.current.selection.isUpdating = false
    })
  })
}

/**
 * Check if the target is inside void and in the editor.
 */

const isTargetInsideVoid = (
  editor: ReactEditor,
  target: EventTarget | null
): boolean => {
  const slateNode =
    hasTarget(editor, target) && ReactEditor.toSlateNode(editor, target)
  return Editor.isVoid(editor, slateNode)
}
