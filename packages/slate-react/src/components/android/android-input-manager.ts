import { ReactEditor } from '../../plugin/react-editor'
import { Editor, Range, Transforms, Text } from 'slate'
import {
  IS_COMPOSING,
  IS_ON_COMPOSITION_END,
  EDITOR_ON_COMPOSITION_TEXT,
} from '../../utils/weak-maps'

import { DOMNode } from '../../utils/dom'

import {
  normalizeTextInsertionRange,
  combineInsertedText,
  TextInsertion,
} from './diff-text'
import {
  gatherMutationData,
  isDeletion,
  isLineBreak,
  isRemoveLeafNodes,
  isReplaceExpandedSelection,
  isTextInsertion,
} from './mutation-detection'

// Replace with `const debug = console.log` to debug
const debug = (...message: any[]) => {}

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

export class AndroidInputManager {
  constructor(private editor: ReactEditor, private restoreDOM: () => void) {
    this.editor = editor
    this.restoreDOM = restoreDOM
  }

  /**
   * Handle MutationObserver flush
   *
   * @param mutations
   */

  flush = (mutations: MutationRecord[]) => {
    debug('flush')

    try {
      this.reconcileMutations(mutations)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)

      // Failed to reconcile mutations, restore DOM to its previous state
      this.restoreDOM()
    }
  }

  /**
   * Reconcile a batch of mutations
   *
   * @param mutations
   */

  private reconcileMutations = (mutations: MutationRecord[]) => {
    const mutationData = gatherMutationData(this.editor, mutations)
    const { insertedText, removedNodes } = mutationData

    debug('processMutations', mutations, mutationData)

    if (isReplaceExpandedSelection(this.editor, mutationData)) {
      const text = combineInsertedText(insertedText)
      this.replaceExpandedSelection(text)
    } else if (isLineBreak(this.editor, mutationData)) {
      this.insertBreak()
    } else if (isRemoveLeafNodes(this.editor, mutationData)) {
      this.removeLeafNodes(removedNodes)
    } else if (isDeletion(this.editor, mutationData)) {
      this.deleteBackward()
    } else if (isTextInsertion(this.editor, mutationData)) {
      this.insertText(insertedText)
    }
  }

  /**
   * Apply text diff
   */

  private insertText = (insertedText: TextInsertion[]) => {
    debug('insertText')

    const { selection } = this.editor

    // If it is in composing or after `onCompositionend`, set `EDITOR_ON_COMPOSITION_TEXT` and return.
    // Text will be inserted on compositionend event.
    if (
      IS_COMPOSING.get(this.editor) ||
      IS_ON_COMPOSITION_END.get(this.editor)
    ) {
      EDITOR_ON_COMPOSITION_TEXT.set(this.editor, insertedText)
      IS_ON_COMPOSITION_END.set(this.editor, false)
      return
    }

    // Insert the batched text diffs
    insertedText.forEach(insertion => {
      const text = insertion.text.insertText
      const at = normalizeTextInsertionRange(this.editor, selection, insertion)
      Transforms.setSelection(this.editor, at)
      Editor.insertText(this.editor, text)
    })
  }

  /**
   * Handle line breaks
   */

  private insertBreak = () => {
    debug('insertBreak')

    const { selection } = this.editor

    Editor.insertBreak(this.editor)

    this.restoreDOM()

    if (selection) {
      // Compat: Move selection to the newly inserted block if it has not moved
      setTimeout(() => {
        if (
          this.editor.selection &&
          Range.equals(selection, this.editor.selection)
        ) {
          Transforms.move(this.editor)
        }
      }, 100)
    }
  }

  /**
   * Handle expanded selection being deleted or replaced by text
   */

  private replaceExpandedSelection = (text: string) => {
    debug('replaceExpandedSelection')

    // Delete expanded selection
    Editor.deleteFragment(this.editor)

    if (text.length) {
      // Selection was replaced by text, insert the entire text diff
      Editor.insertText(this.editor, text)
    }

    this.restoreDOM()
  }

  /**
   * Handle `backspace` that merges blocks
   */

  private deleteBackward = () => {
    debug('deleteBackward')

    Editor.deleteBackward(this.editor)
    ReactEditor.focus(this.editor)

    this.restoreDOM()
  }

  /**
   * Handle mutations that remove specific leaves
   */
  private removeLeafNodes = (nodes: DOMNode[]) => {
    for (const node of nodes) {
      const slateNode = ReactEditor.toSlateNode(this.editor, node)

      if (slateNode) {
        const path = ReactEditor.findPath(this.editor, slateNode)

        Transforms.delete(this.editor, { at: path })
        this.restoreDOM()
      }
    }
  }
}

export default AndroidInputManager
