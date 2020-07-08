export declare const Transforms: {
    delete(editor: import("..").Editor, options?: {
        at?: import("..").Path | import("..").Point | import("..").Range | undefined;
        distance?: number | undefined;
        unit?: "character" | "word" | "line" | "block" | undefined;
        reverse?: boolean | undefined;
        hanging?: boolean | undefined;
        voids?: boolean | undefined;
    }): void;
    insertFragment(editor: import("..").Editor, fragment: import("..").Node[], options?: {
        at?: import("..").Path | import("..").Point | import("..").Range | undefined;
        hanging?: boolean | undefined;
        voids?: boolean | undefined;
    }): void;
    insertText(editor: import("..").Editor, text: string, options?: {
        at?: import("..").Path | import("..").Point | import("..").Range | undefined;
        voids?: boolean | undefined;
    }): void;
    collapse(editor: import("..").Editor, options?: {
        edge?: "anchor" | "focus" | "start" | "end" | undefined;
    }): void;
    deselect(editor: import("..").Editor): void;
    move(editor: import("..").Editor, options?: {
        distance?: number | undefined;
        unit?: "offset" | "character" | "word" | "line" | undefined;
        reverse?: boolean | undefined;
        edge?: "anchor" | "focus" | "start" | "end" | undefined;
    }): void;
    select(editor: import("..").Editor, target: import("..").Location): void;
    setPoint(editor: import("..").Editor, props: Partial<import("..").Point>, options: {
        edge?: "anchor" | "focus" | "start" | "end" | undefined;
    }): void;
    setSelection(editor: import("..").Editor, props: Partial<import("..").Range>): void;
    insertNodes(editor: import("..").Editor, nodes: import("..").Editor | import("..").Element | import("..").Text | import("..").Node[], options?: {
        at?: import("..").Path | import("..").Point | import("..").Range | undefined;
        match?: ((node: import("..").Node) => boolean) | undefined;
        mode?: "highest" | "lowest" | undefined;
        hanging?: boolean | undefined;
        select?: boolean | undefined;
        voids?: boolean | undefined;
    }): void;
    liftNodes(editor: import("..").Editor, options?: {
        at?: import("..").Path | import("..").Point | import("..").Range | undefined;
        match?: ((node: import("..").Node) => boolean) | undefined;
        mode?: "highest" | "lowest" | "all" | undefined;
        voids?: boolean | undefined;
    }): void;
    mergeNodes(editor: import("..").Editor, options?: {
        at?: import("..").Path | import("..").Point | import("..").Range | undefined;
        match?: ((node: import("..").Node) => boolean) | undefined;
        mode?: "highest" | "lowest" | undefined;
        hanging?: boolean | undefined;
        voids?: boolean | undefined;
    }): void;
    moveNodes(editor: import("..").Editor, options: {
        at?: import("..").Path | import("..").Point | import("..").Range | undefined;
        match?: ((node: import("..").Node) => boolean) | undefined;
        mode?: "highest" | "lowest" | "all" | undefined;
        to: import("..").Path;
        voids?: boolean | undefined;
    }): void;
    removeNodes(editor: import("..").Editor, options?: {
        at?: import("..").Path | import("..").Point | import("..").Range | undefined;
        match?: ((node: import("..").Node) => boolean) | undefined;
        mode?: "highest" | "lowest" | undefined;
        hanging?: boolean | undefined;
        voids?: boolean | undefined;
    }): void;
    setNodes(editor: import("..").Editor, props: Partial<import("..").Editor> | Partial<import("..").Element> | Partial<import("..").Text>, options?: {
        at?: import("..").Path | import("..").Point | import("..").Range | undefined;
        match?: ((node: import("..").Node) => boolean) | undefined;
        mode?: "highest" | "lowest" | "all" | undefined;
        hanging?: boolean | undefined;
        split?: boolean | undefined;
        voids?: boolean | undefined;
    }): void;
    splitNodes(editor: import("..").Editor, options?: {
        at?: import("..").Path | import("..").Point | import("..").Range | undefined;
        match?: ((node: import("..").Node) => boolean) | undefined;
        mode?: "highest" | "lowest" | undefined;
        always?: boolean | undefined;
        height?: number | undefined;
        voids?: boolean | undefined;
    }): void;
    unsetNodes(editor: import("..").Editor, props: string | string[], options?: {
        at?: import("..").Path | import("..").Point | import("..").Range | undefined;
        match?: ((node: import("..").Node) => boolean) | undefined;
        mode?: "highest" | "lowest" | "all" | undefined;
        split?: boolean | undefined;
        voids?: boolean | undefined;
    }): void;
    unwrapNodes(editor: import("..").Editor, options: {
        at?: import("..").Path | import("..").Point | import("..").Range | undefined;
        match?: ((node: import("..").Node) => boolean) | undefined;
        mode?: "highest" | "lowest" | "all" | undefined;
        split?: boolean | undefined;
        voids?: boolean | undefined;
    }): void;
    wrapNodes(editor: import("..").Editor, element: import("..").Element, options?: {
        at?: import("..").Path | import("..").Point | import("..").Range | undefined;
        match?: ((node: import("..").Node) => boolean) | undefined;
        mode?: "highest" | "lowest" | "all" | undefined;
        split?: boolean | undefined;
        voids?: boolean | undefined;
    }): void;
    transform(editor: import("..").Editor, op: import("..").Operation): void;
};
//# sourceMappingURL=index.d.ts.map