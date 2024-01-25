import { Editor, Path, Range } from 'slate';
import { DOMNode } from '../../utils/dom';
export declare type Diff = {
    start: number;
    end: number;
    insertText: string;
    removeText: string;
};
export interface TextInsertion {
    text: Diff;
    path: Path;
}
/**
 * Takes two strings and returns a smart diff that can be used to describe the
 * change in a way that can be used as operations like inserting, removing or
 * replacing text.
 *
 * @param prev the previous text
 * @param next the next text
 * @returns the text difference
 */
export declare function diffText(prev?: string, next?: string): Diff | null;
export declare function combineInsertedText(insertedText: TextInsertion[]): string;
export declare function getTextInsertion<T extends Editor>(editor: T, domNode: DOMNode): TextInsertion | undefined;
export declare function normalizeTextInsertionRange(editor: Editor, range: Range | null, { path, text }: TextInsertion): {
    anchor: {
        path: Path;
        offset: number;
    };
    focus: {
        path: Path;
        offset: number;
    };
};
//# sourceMappingURL=diff-text.d.ts.map