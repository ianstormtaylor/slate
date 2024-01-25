/// <reference types="react" />
import { Editor } from 'slate';
declare type EditorChangeHandler = (editor: Editor) => void;
/**
 * A React context for sharing the editor selector context in a way to control rerenders
 */
export declare const SlateSelectorContext: import("react").Context<{
    getSlate: () => Editor;
    addEventListener: (callback: EditorChangeHandler) => () => void;
}>;
/**
 * use redux style selectors to prevent rerendering on every keystroke.
 * Bear in mind rerendering can only prevented if the returned value is a value type or for reference types (e.g. objects and arrays) add a custom equality function.
 *
 * Example:
 * ```
 *  const isSelectionActive = useSlateSelector(editor => Boolean(editor.selection));
 * ```
 */
export declare function useSlateSelector<T>(selector: (editor: Editor) => T, equalityFn?: (a: T, b: T) => boolean): T;
/**
 * Create selector context with editor updating on every editor change
 */
export declare function getSelectorContext(editor: Editor): {
    selectorContext: {
        getSlate: () => import("..").ReactEditor;
        addEventListener: (callback: EditorChangeHandler) => () => void;
    };
    onChange: (editor: Editor) => void;
};
export {};
//# sourceMappingURL=use-slate-selector.d.ts.map