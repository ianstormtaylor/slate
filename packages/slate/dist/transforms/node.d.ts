import { Editor, Element, Node, Path, Point, Range, Text } from '..';
export declare const NodeTransforms: {
    /**
     * Insert nodes at a specific location in the Editor.
     */
    insertNodes(editor: Editor, nodes: Editor | Element | Text | Node[], options?: {
        at?: Path | Point | Range | undefined;
        match?: ((node: Node) => boolean) | undefined;
        mode?: "highest" | "lowest" | undefined;
        hanging?: boolean | undefined;
        select?: boolean | undefined;
        voids?: boolean | undefined;
    }): void;
    /**
     * Lift nodes at a specific location upwards in the document tree, splitting
     * their parent in two if necessary.
     */
    liftNodes(editor: Editor, options?: {
        at?: Path | Point | Range | undefined;
        match?: ((node: Node) => boolean) | undefined;
        mode?: "highest" | "lowest" | "all" | undefined;
        voids?: boolean | undefined;
    }): void;
    /**
     * Merge a node at a location with the previous node of the same depth,
     * removing any empty containing nodes after the merge if necessary.
     */
    mergeNodes(editor: Editor, options?: {
        at?: Path | Point | Range | undefined;
        match?: ((node: Node) => boolean) | undefined;
        mode?: "highest" | "lowest" | undefined;
        hanging?: boolean | undefined;
        voids?: boolean | undefined;
    }): void;
    /**
     * Move the nodes at a location to a new location.
     */
    moveNodes(editor: Editor, options: {
        at?: Path | Point | Range | undefined;
        match?: ((node: Node) => boolean) | undefined;
        mode?: "highest" | "lowest" | "all" | undefined;
        to: Path;
        voids?: boolean | undefined;
    }): void;
    /**
     * Remove the nodes at a specific location in the document.
     */
    removeNodes(editor: Editor, options?: {
        at?: Path | Point | Range | undefined;
        match?: ((node: Node) => boolean) | undefined;
        mode?: "highest" | "lowest" | undefined;
        hanging?: boolean | undefined;
        voids?: boolean | undefined;
    }): void;
    /**
     * Set new properties on the nodes at a location.
     */
    setNodes(editor: Editor, props: Partial<Editor> | Partial<Element> | Partial<Text>, options?: {
        at?: Path | Point | Range | undefined;
        match?: ((node: Node) => boolean) | undefined;
        mode?: "highest" | "lowest" | "all" | undefined;
        hanging?: boolean | undefined;
        split?: boolean | undefined;
        voids?: boolean | undefined;
    }): void;
    /**
     * Split the nodes at a specific location.
     */
    splitNodes(editor: Editor, options?: {
        at?: Path | Point | Range | undefined;
        match?: ((node: Node) => boolean) | undefined;
        mode?: "highest" | "lowest" | undefined;
        always?: boolean | undefined;
        height?: number | undefined;
        voids?: boolean | undefined;
    }): void;
    /**
     * Unset properties on the nodes at a location.
     */
    unsetNodes(editor: Editor, props: string | string[], options?: {
        at?: Path | Point | Range | undefined;
        match?: ((node: Node) => boolean) | undefined;
        mode?: "highest" | "lowest" | "all" | undefined;
        split?: boolean | undefined;
        voids?: boolean | undefined;
    }): void;
    /**
     * Unwrap the nodes at a location from a parent node, splitting the parent if
     * necessary to ensure that only the content in the range is unwrapped.
     */
    unwrapNodes(editor: Editor, options: {
        at?: Path | Point | Range | undefined;
        match?: ((node: Node) => boolean) | undefined;
        mode?: "highest" | "lowest" | "all" | undefined;
        split?: boolean | undefined;
        voids?: boolean | undefined;
    }): void;
    /**
     * Wrap the nodes at a location in a new container node, splitting the edges
     * of the range first to ensure that only the content in the range is wrapped.
     */
    wrapNodes(editor: Editor, element: Element, options?: {
        at?: Path | Point | Range | undefined;
        match?: ((node: Node) => boolean) | undefined;
        mode?: "highest" | "lowest" | "all" | undefined;
        split?: boolean | undefined;
        voids?: boolean | undefined;
    }): void;
};
//# sourceMappingURL=node.d.ts.map