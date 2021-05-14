import { ReactEditor } from '../../plugin/react-editor'
import { Editor, Range, Transforms } from 'slate'

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
import { restoreDOM } from './restore-dom'

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
 */

export class AndroidInputManager {
  constructor(private editor: ReactEditor) {
    this.editor = editor
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
      restoreDOM(this.editor)
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

    // Insert the batched text diffs
    insertedText.forEach(insertion => {
      Transforms.insertText(this.editor, insertion.text.insertText, {
        at: normalizeTextInsertionRange(this.editor, selection, insertion),
      })
    })
  }

  /**
   * Handle line breaks
   */

  private insertBreak = () => {
    debug('insertBreak')

    const { selection } = this.editor

    Editor.insertBreak(this.editor)

    // To-do: Need a more granular solution to restoring only a specific portion
    // of the document. Restoring the entire document is expensive.
    restoreDOM(this.editor)

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

    restoreDOM(this.editor)
  }

  /**
   * Handle `backspace` that merges blocks
   */

  private deleteBackward = () => {
    debug('deleteBackward')

    Editor.deleteBackward(this.editor)
    ReactEditor.focus(this.editor)

    restoreDOM(this.editor)
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
        restoreDOM(this.editor)
      }
    }
  }
}

export default AndroidInputManager
