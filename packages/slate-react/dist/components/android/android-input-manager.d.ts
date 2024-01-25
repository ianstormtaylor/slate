import { ReactEditor } from '../../plugin/react-editor';
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
export declare class AndroidInputManager {
    private editor;
    private restoreDOM;
    constructor(editor: ReactEditor, restoreDOM: () => void);
    /**
     * Handle MutationObserver flush
     *
     * @param mutations
     */
    flush: (mutations: MutationRecord[]) => void;
    /**
     * Reconcile a batch of mutations
     *
     * @param mutations
     */
    private reconcileMutations;
    /**
     * Apply text diff
     */
    private insertText;
    /**
     * Handle line breaks
     */
    private insertBreak;
    /**
     * Handle expanded selection being deleted or replaced by text
     */
    private replaceExpandedSelection;
    /**
     * Handle `backspace` that merges blocks
     */
    private deleteBackward;
    /**
     * Handle mutations that remove specific leaves
     */
    private removeLeafNodes;
}
export default AndroidInputManager;
//# sourceMappingURL=android-input-manager.d.ts.map