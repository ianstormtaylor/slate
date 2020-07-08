import { Editor } from 'slate';
import { HistoryEditor } from './history-editor';
/**
 * The `withHistory` plugin keeps track of the operation history of a Slate
 * editor as operations are applied to it, using undo and redo stacks.
 */
export declare const withHistory: <T extends Editor>(editor: T) => T & HistoryEditor;
//# sourceMappingURL=with-history.d.ts.map