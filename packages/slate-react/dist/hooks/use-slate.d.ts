/// <reference types="react" />
import { Editor } from 'slate';
import { ReactEditor } from '../plugin/react-editor';
/**
 * A React context for sharing the editor object, in a way that re-renders the
 * context whenever changes occur.
 */
export declare const SlateContext: import("react").Context<[ReactEditor] | null>;
/**
 * Get the current editor object from the React context.
 */
export declare const useSlate: () => Editor;
//# sourceMappingURL=use-slate.d.ts.map