/// <reference types="react" />
import { ReactEditor } from '../plugin/react-editor';
import { Editor } from 'slate';
/**
 * A React context for sharing the editor object.
 */
export declare const EditorContext: import("react").Context<ReactEditor | null>;
/**
 * Get the current editor object from the React context.
 */
export declare const useSlateStatic: () => Editor;
//# sourceMappingURL=use-slate-static.d.ts.map