import { DebouncedFunc } from 'lodash'
import { Editor, Range, Transforms, Path } from 'slate'
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
  mergeTextInsertions,
} from './diff-text'
import {
  gatherMutationData,
  isDeletion,
  isLineBreak,
  isRemoveLeafNodes,
  isReplaceExpandedSelection,
  isTextInsertion,
  isUnwrapNode,
} from './mutation-detection'
import uniqWith from 'lodash/uniqWith'

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
    const mutationData = gatherMutationData(editor, mutations)
    const { insertedText, removedNodes } = mutationData

    debug('reconcileMutations', mutations, mutationData)

    if (isReplaceExpandedSelection(editor, mutationData)) {
      const text = combineInsertedText(insertedText)
      replaceExpandedSelection(text)
    } else if (isLineBreak(editor, mutationData)) {
      insertBreak()
    } else if (isRemoveLeafNodes(editor, mutationData)) {
      removeLeafNodes(removedNodes)
    } else if (isUnwrapNode(editor, mutationData)) {
      debug('unwrap node')
      flush()
      restoreDom()

      // TODO: force re-render in another way or just restore the selection directly
      if (editor.selection) {
        Editor.addMark(editor, 'test', true)
      }
    } else if (isDeletion(editor, mutationData)) {
      deleteBackward()
    } else if (isTextInsertion(editor, mutationData)) {
      insertText(insertedText)
    }
  }

  /**
   * Apply text diff
   */

  const insertText = (insertedText: TextInsertion[]) => {
    debug('insertText')

    const combinedInsertions: TextInsertion[] = uniqWith(
      [...insertedText, ...(EDITOR_TO_PENDING_INSERTIONS.get(editor) ?? [])],
      (a, b) => Path.equals(a.path, b.path)
    )

    EDITOR_TO_PENDING_INSERTIONS.set(editor, combinedInsertions)

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

    debug('pendingChanges', pendingChanges)

    const { selection } = editor
    pendingChanges.forEach(insertion => {
      const text = insertion.text.insertText
      const at = normalizeTextInsertionRange(editor, selection, insertion)
      Transforms.setSelection(editor, at)
      Editor.insertText(editor, text)
    })

    scheduleOnDOMSelectionChange.flush()
    onDOMSelectionChange.flush()

    debug('selection after', editor.selection)
  }

  /**
   * Handle line breaks
   */

  const insertBreak = () => {
    debug('insertBreak')

    const { selection } = editor
    Editor.insertBreak(editor)

    restoreDom()

    if (selection) {
      // Compat: Move selection to the newly inserted block if it has not moved
      setTimeout(() => {
        if (editor.selection && Range.equals(selection, editor.selection)) {
          Transforms.move(editor)
        }
      }, 100)
    }
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
    debug('deleteBackward')

    // TODO: Handle text replacement affecting the selection
    Editor.withoutNormalizing(editor, () => {
      Editor.deleteBackward(editor)
      ReactEditor.focus(editor)
    })

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

    scheduleOnDOMSelectionChange.flush()
    onDOMSelectionChange.flush()

    return true
  }

  const hasPendingChanges = () => {
    return !!EDITOR_TO_PENDING_INSERTIONS.get(editor)?.length
  }

  const handleDOMSelectionChange = () => {
    if (hasPendingChanges()) {
      // Delay selection change until pending changes are flushed
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
