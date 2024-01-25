import { HistoryEditor } from './history-editor';
/**
 * The `withHistory` plugin keeps track of the operation history of a Slate
 * editor as operations are applied to it, using undo and redo stacks.
 *
 * If you are using TypeScript, you must extend Slate's CustomTypes to use
 * this plugin.
 *
 * See https://docs.slatejs.org/concepts/11-typescript to learn how.
 */
export declare const withHistory: <T extends import("slate").BaseEditor>(editor: T) => T & HistoryEditor;
//# sourceMappingURL=with-history.d.ts.map