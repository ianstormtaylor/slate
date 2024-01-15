import { BaseEditor } from 'slate';
import { History } from './history';
/**
 * Weakmaps for attaching state to the editor.
 */
export declare const HISTORY: WeakMap<BaseEditor, History>;
export declare const SAVING: WeakMap<BaseEditor, boolean | undefined>;
export declare const MERGING: WeakMap<BaseEditor, boolean | undefined>;
/**
 * `HistoryEditor` contains helpers for history-enabled editors.
 */
export interface HistoryEditor extends BaseEditor {
    history: History;
    undo: () => void;
    redo: () => void;
    writeHistory: (stack: 'undos' | 'redos', batch: any) => void;
}
export declare const HistoryEditor: {
    /**
     * Check if a value is a `HistoryEditor` object.
     */
    isHistoryEditor(value: any): value is HistoryEditor;
    /**
     * Get the merge flag's current value.
     */
    isMerging(editor: HistoryEditor): boolean | undefined;
    /**
     * Get the saving flag's current value.
     */
    isSaving(editor: HistoryEditor): boolean | undefined;
    /**
     * Redo to the previous saved state.
     */
    redo(editor: HistoryEditor): void;
    /**
     * Undo to the previous saved state.
     */
    undo(editor: HistoryEditor): void;
    /**
     * Apply a series of changes inside a synchronous `fn`, without merging any of
     * the new operations into previous save point in the history.
     */
    withoutMerging(editor: HistoryEditor, fn: () => void): void;
    /**
     * Apply a series of changes inside a synchronous `fn`, without saving any of
     * their operations into the history.
     */
    withoutSaving(editor: HistoryEditor, fn: () => void): void;
};
//# sourceMappingURL=history-editor.d.ts.map