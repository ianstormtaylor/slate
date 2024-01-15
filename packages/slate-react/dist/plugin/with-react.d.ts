import { BaseEditor } from 'slate';
import { ReactEditor } from './react-editor';
/**
 * `withReact` adds React and DOM specific behaviors to the editor.
 *
 * If you are using TypeScript, you must extend Slate's CustomTypes to use
 * this plugin.
 *
 * See https://docs.slatejs.org/concepts/11-typescript to learn how.
 */
export declare const withReact: <T extends BaseEditor>(editor: T, clipboardFormatKey?: string) => T & ReactEditor;
//# sourceMappingURL=with-react.d.ts.map