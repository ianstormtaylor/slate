import { Editor, Location, Node } from '../../index';
import { TextUnit } from '../../types/types';
export interface TextDeleteOptions {
    at?: Location;
    distance?: number;
    unit?: TextUnit;
    reverse?: boolean;
    hanging?: boolean;
    voids?: boolean;
}
export interface TextInsertFragmentOptions {
    at?: Location;
    hanging?: boolean;
    voids?: boolean;
}
export interface TextInsertTextOptions {
    at?: Location;
    voids?: boolean;
}
export interface TextTransforms {
    /**
     * Delete content in the editor.
     */
    delete: (editor: Editor, options?: TextDeleteOptions) => void;
    /**
     * Insert a fragment in the editor
     * at the specified location or (if not defined) the current selection or (if not defined) the end of the document.
     */
    insertFragment: (editor: Editor, fragment: Node[], options?: TextInsertFragmentOptions) => void;
    /**
     * Insert a string of text in the editor
     * at the specified location or (if not defined) the current selection or (if not defined) the end of the document.
     */
    insertText: (editor: Editor, text: string, options?: TextInsertTextOptions) => void;
}
export declare const TextTransforms: TextTransforms;
//# sourceMappingURL=text.d.ts.map