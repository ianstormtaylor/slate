import { Editor, Element, ElementEntry, Path, Range, Text } from '..';
/**
 * The `Node` union type represents all of the different types of nodes that
 * occur in a Slate document tree.
 */
export declare type Node = Editor | Element | Text;
export declare const Node: {
    /**
     * Get the node at a specific path, asserting that it's an ancestor node.
     */
    ancestor(root: Node, path: Path): Ancestor;
    /**
     * Return an iterable of all the ancestor nodes above a specific path.
     *
     * By default the order is bottom-up, from lowest to highest ancestor in
     * the tree, but you can pass the `reverse: true` option to go top-down.
     */
    ancestors(root: Node, path: Path, options?: {
        reverse?: boolean | undefined;
    }): Iterable<NodeEntry<Ancestor>>;
    /**
     * Get the child of a node at a specific index.
     */
    child(root: Node, index: number): Descendant;
    /**
     * Iterate over the children of a node at a specific path.
     */
    children(root: Node, path: Path, options?: {
        reverse?: boolean | undefined;
    }): Iterable<NodeEntry<Descendant>>;
    /**
     * Get an entry for the common ancesetor node of two paths.
     */
    common(root: Node, path: Path, another: Path): NodeEntry<Node>;
    /**
     * Get the node at a specific path, asserting that it's a descendant node.
     */
    descendant(root: Node, path: Path): Descendant;
    /**
     * Return an iterable of all the descendant node entries inside a root node.
     */
    descendants(root: Node, options?: {
        from?: Path | undefined;
        to?: Path | undefined;
        reverse?: boolean | undefined;
        pass?: ((node: NodeEntry<Node>) => boolean) | undefined;
    }): Iterable<NodeEntry<Descendant>>;
    /**
     * Return an iterable of all the element nodes inside a root node. Each iteration
     * will return an `ElementEntry` tuple consisting of `[Element, Path]`. If the
     * root node is an element it will be included in the iteration as well.
     */
    elements(root: Node, options?: {
        from?: Path | undefined;
        to?: Path | undefined;
        reverse?: boolean | undefined;
        pass?: ((node: NodeEntry<Node>) => boolean) | undefined;
    }): Iterable<ElementEntry>;
    /**
     * Get the first node entry in a root node from a path.
     */
    first(root: Node, path: Path): NodeEntry<Node>;
    /**
     * Get the sliced fragment represented by a range inside a root node.
     */
    fragment(root: Node, range: Range): Descendant[];
    /**
     * Get the descendant node referred to by a specific path. If the path is an
     * empty array, it refers to the root node itself.
     */
    get(root: Node, path: Path): Node;
    /**
     * Check if a descendant node exists at a specific path.
     */
    has(root: Node, path: Path): boolean;
    /**
     * Check if a value implements the `Node` interface.
     */
    isNode(value: any): value is Node;
    /**
     * Check if a value is a list of `Node` objects.
     */
    isNodeList(value: any): value is Node[];
    /**
     * Get the lash node entry in a root node from a path.
     */
    last(root: Node, path: Path): NodeEntry<Node>;
    /**
     * Get the node at a specific path, ensuring it's a leaf text node.
     */
    leaf(root: Node, path: Path): Text;
    /**
     * Return an iterable of the in a branch of the tree, from a specific path.
     *
     * By default the order is top-down, from lowest to highest node in the tree,
     * but you can pass the `reverse: true` option to go bottom-up.
     */
    levels(root: Node, path: Path, options?: {
        reverse?: boolean | undefined;
    }): Iterable<NodeEntry<Node>>;
    /**
     * Check if a node matches a set of props.
     */
    matches(node: Node, props: Partial<Editor> | Partial<Element> | Partial<Text>): boolean;
    /**
     * Return an iterable of all the node entries of a root node. Each entry is
     * returned as a `[Node, Path]` tuple, with the path referring to the node's
     * position inside the root node.
     */
    nodes(root: Node, options?: {
        from?: Path | undefined;
        to?: Path | undefined;
        reverse?: boolean | undefined;
        pass?: ((entry: NodeEntry<Node>) => boolean) | undefined;
    }): Iterable<NodeEntry<Node>>;
    /**
     * Get the parent of a node at a specific path.
     */
    parent(root: Node, path: Path): Ancestor;
    /**
     * Get the concatenated text string of a node's content.
     *
     * Note that this will not include spaces or line breaks between block nodes.
     * It is not a user-facing string, but a string for performing offset-related
     * computations for a node.
     */
    string(node: Node): string;
    /**
     * Return an iterable of all leaf text nodes in a root node.
     */
    texts(root: Node, options?: {
        from?: Path | undefined;
        to?: Path | undefined;
        reverse?: boolean | undefined;
        pass?: ((node: NodeEntry<Node>) => boolean) | undefined;
    }): Iterable<NodeEntry<Text>>;
};
/**
 * The `Descendant` union type represents nodes that are descendants in the
 * tree. It is returned as a convenience in certain cases to narrow a value
 * further than the more generic `Node` union.
 */
export declare type Descendant = Element | Text;
/**
 * The `Ancestor` union type represents nodes that are ancestors in the tree.
 * It is returned as a convenience in certain cases to narrow a value further
 * than the more generic `Node` union.
 */
export declare type Ancestor = Editor | Element;
/**
 * `NodeEntry` objects are returned when iterating over the nodes in a Slate
 * document tree. They consist of the node and its `Path` relative to the root
 * node in the document.
 */
export declare type NodeEntry<T extends Node = Node> = [T, Path];
//# sourceMappingURL=node.d.ts.map