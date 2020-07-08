import { Editor, Node, Path, Point, Range } from '..';
export declare const TextTransforms: {
    /**
     * Delete content in the editor.
     */
    delete(editor: Editor, options?: {
        at?: Path | Point | Range | undefined;
        distance?: number | undefined;
        unit?: "character" | "word" | "line" | "block" | undefined;
        reverse?: boolean | undefined;
        hanging?: boolean | undefined;
        voids?: boolean | undefined;
    }): void;
    /**
     * Insert a fragment at a specific location in the editor.
     */
    insertFragment(editor: Editor, fragment: Node[], options?: {
        at?: Path | Point | Range | undefined;
        hanging?: boolean | undefined;
        voids?: boolean | undefined;
    }): void;
    /**
     * Insert a string of text in the Editor.
     */
    insertText(editor: Editor, text: string, options?: {
        at?: Path | Point | Range | undefined;
        voids?: boolean | undefined;
    }): void;
};
//# sourceMappingURL=text.d.ts.map