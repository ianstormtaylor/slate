import { Editor, Location, Node } from '..';
import { TextUnit } from '../interfaces/types';
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
    delete: (editor: Editor, options?: TextDeleteOptions) => void;
    insertFragment: (editor: Editor, fragment: Node[], options?: TextInsertFragmentOptions) => void;
    insertText: (editor: Editor, text: string, options?: TextInsertTextOptions) => void;
}
export declare const TextTransforms: TextTransforms;
//# sourceMappingURL=text.d.ts.map