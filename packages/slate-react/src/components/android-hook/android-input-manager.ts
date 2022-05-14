import { DebouncedFunc } from 'lodash'
import { Editor, Range, Transforms } from 'slate'
import { ReactEditor } from '../../plugin/react-editor'
import { DOMNode } from '../../utils/dom'
import {
  EDITOR_TO_PENDING_INSERTIONS,
  IS_COMPOSING,
} from '../../utils/weak-maps'
import {
  combineInsertedText,
  normalizeTextInsertionRange,
  TextInsertion,
} from './diff-text'
import {
  gatherMutationData,
  isDeletion,
  isLineBreak,
  isRemoveLeafNodes,
  isReplaceExpandedSelection,
} from './mutation-detection'

//

// https://github.com/facebook/draft-js/blob/main/src/component/handlers/composition/DraftEditorCompositionHandler.js#L41
// When using keyboard English association function, conpositionEnd triggered too fast, resulting in after `insertText` still maintain association state.
const RESOLVE_DELAY = 25

// Replace with `const debug = console.log` to debug
const debug = console.log

/**
 * Based loosely on:
 *
 * https://github.com/facebook/draft-js/blob/master/src/component/handlers/composition/DOMObserver.js
 * https://github.com/ProseMirror/prosemirror-view/blob/master/src/domobserver.js
 *
 * The input manager attempts to map observed mutations on the document to a
 * set of operations in order to reconcile Slate's internal value with the DOM.
 *
 * Mutations are processed synchronously as they come in. Only mutations that occur
 * during a user input loop are processed, as other mutations can occur within the
 * document that were not initiated by user input.
 *
 * The mutation reconciliation process attempts to match mutations to the following
 * patterns:
 *
 * - Text updates
 * - Deletions
 * - Line breaks
 *
 * @param editor
 * @param restoreDOM
 */

export type CreateAndroidInputManagerOptions = {
  editor: ReactEditor
  restoreDom: () => void
  onUserInput: () => void

  scheduleOnDOMSelectionChange: DebouncedFunc<() => void>
  onDOMSelectionChange: DebouncedFunc<() => void>
}

export function createAndroidInputManager({
  editor,
  restoreDom,
  onUserInput,

  scheduleOnDOMSelectionChange,
  onDOMSelectionChange,
}: CreateAndroidInputManagerOptions) {
  let compositionEndTimeoutId: ReturnType<typeof setTimeout> | null = null

  /**
   * Handle MutationObserver flush
   *
   * @param mutations
   */

  const handleMutations = (mutations: MutationRecord[]) => {
    try {
      reconcileMutations(mutations)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)

      // Failed to reconcile mutations, restore DOM to its previous state
      restoreDom()
    }
  }

  /**
   * Reconcile a batch of mutations
   *
   * @param mutations
   */

  const reconcileMutations = (mutations: MutationRecord[]) => {
    const mutationData = gatherMutationData(
      editor,
      mutations,
      EDITOR_TO_PENDING_INSERTIONS.get(editor)
    )

    const { insertedText, removedNodes } = mutationData

    debug('reconcileMutations', mutations, mutationData)

    if (isReplaceExpandedSelection(editor, mutationData)) {
      const text = combineInsertedText(insertedText)
      replaceExpandedSelection(text)
    } else if (isLineBreak(editor, mutationData)) {
      insertBreak()
    } else if (isRemoveLeafNodes(editor, mutationData)) {
      removeLeafNodes(removedNodes)
    } else if (isDeletion(editor, mutationData)) {
      deleteBackward()
    } else {
      insertText(insertedText)
    }
  }

  /**
   * Apply text diff
   */

  const insertText = (insertedText: TextInsertion[]) => {
    debug('insertText', insertedText)

    EDITOR_TO_PENDING_INSERTIONS.set(editor, insertedText)

    if (!ReactEditor.isComposing(editor)) {
      flush()
    }
  }

  const flush = () => {
    // TODO: Apply selection with op if we just manually mutated it.
    debug('flushPendingChanges', editor.selection)

    if (compositionEndTimeoutId) {
      clearTimeout(compositionEndTimeoutId)
      IS_COMPOSING.set(editor, false)
    }

    const pendingChanges = EDITOR_TO_PENDING_INSERTIONS.get(editor)
    EDITOR_TO_PENDING_INSERTIONS.set(editor, [])
    if (!pendingChanges?.length) {
      scheduleOnDOMSelectionChange.flush()
      onDOMSelectionChange.flush()
      return
    }

    debug('apply changes', pendingChanges, editor.selection)

    const { selection } = editor
    pendingChanges.forEach(insertion => {
      const text = insertion.text.insertText
      const at = normalizeTextInsertionRange(editor, selection, insertion)
      Transforms.setSelection(editor, at)
      Editor.insertText(editor, text)
    })

    if (pendingChanges) {
      scheduleOnDOMSelectionChange()
      scheduleOnDOMSelectionChange.flush()
      onDOMSelectionChange.flush()
    }

    restoreDom()
  }

  /**
   * Handle line breaks
   */

  const insertBreak = () => {
    flush()
    Editor.insertBreak(editor)
    restoreDom()
  }

  /**
   * Handle expanded selection being deleted or replaced by text
   */

  const replaceExpandedSelection = (text: string) => {
    debug('replaceExpandedSelection')

    // TODO: Handle text replacement affecting the selection
    Editor.withoutNormalizing(editor, () => {
      if (text.length) {
        // Selection was replaced by text, insert the entire text diff
        Editor.insertText(editor, text)
      }

      // Delete expanded selection
      Editor.deleteFragment(editor)
    })

    restoreDom()
  }

  /**
   * Handle `backspace` that merges blocks
   */

  const deleteBackward = () => {
    debug('deleteBackward', editor.selection)

    // COMPAT: GBoard likes to select from the end of the previous line to the start
    // of the current line when deleting backwards at the start of a line.
    const target =
      editor.selection && Editor.unhangRange(editor, editor.selection)

    if (
      target &&
      (!editor.selection || !Range.equals(editor.selection, target))
    ) {
      Transforms.select(editor, target)
    }

    Editor.deleteBackward(editor)
    ReactEditor.focus(editor)

    scheduleOnDOMSelectionChange.cancel()
    onDOMSelectionChange.cancel()

    restoreDom()
  }

  /**
   * Handle mutations that remove specific leaves
   */
  const removeLeafNodes = (nodes: DOMNode[]) => {
    // TODO: Handle text replacement affecting the selection
    Editor.withoutNormalizing(editor, () => {
      for (const node of nodes) {
        const slateNode = ReactEditor.toSlateNode(editor, node)

        if (slateNode) {
          const path = ReactEditor.findPath(editor, slateNode)

          Transforms.delete(editor, { at: path })
          restoreDom()
        }
      }
    })
  }

  const handleCompositionEnd = (
    _event: React.CompositionEvent<HTMLDivElement>
  ) => {
    if (compositionEndTimeoutId) {
      clearTimeout(compositionEndTimeoutId)
    }

    const handleCompositionEnd = () => {
      IS_COMPOSING.set(editor, false)
      flush()
    }

    compositionEndTimeoutId = setTimeout(handleCompositionEnd, RESOLVE_DELAY)
    return true
  }

  const handleCompositionStart = (
    _event: React.CompositionEvent<HTMLDivElement>
  ) => {
    IS_COMPOSING.set(editor, true)

    if (compositionEndTimeoutId) {
      clearTimeout(compositionEndTimeoutId)
      compositionEndTimeoutId = null
    }

    return true
  }

  const handleDOMBeforeInput = (_event: InputEvent) => {
    onUserInput()

    console.log('beforeInputSelection')

    // TODO: Restore dom selection
    scheduleOnDOMSelectionChange.flush()
    onDOMSelectionChange.flush()

    // Set current selection to target range to ensure we are applying the next action
    // to the correct target range (mostly relevant for delete expanded selection)
    const [targetRange] = (event as any).getTargetRanges()
    if (targetRange) {
      const range = ReactEditor.toSlateRange(editor, targetRange, {
        exactMatch: false,
        suppressThrow: true,
      })

      if (range) {
        debug('beforeInputSelection', range)
        editor.selection = range
      }
    }

    return true
  }

  const hasPendingChanges = () => {
    return !!EDITOR_TO_PENDING_INSERTIONS.get(editor)?.length
  }

  const handleDOMSelectionChange = () => {
    // Delay selection change until pending changes are flushed
    if (hasPendingChanges()) {
      scheduleOnDOMSelectionChange()
      return true
    }
  }

  return {
    flush,
    hasPendingChanges,

    handleMutations,

    handleCompositionEnd,
    handleCompositionStart,
    handleDOMSelectionChange,

    handleDOMBeforeInput,
  }
}
