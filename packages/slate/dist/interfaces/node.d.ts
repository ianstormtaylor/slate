import { Editor, Path, Range, Text } from '..';
import { Element, ElementEntry } from './element';
/**
 * The `Node` union type represents all of the different types of nodes that
 * occur in a Slate document tree.
 */
export type BaseNode = Editor | Element | Text;
export type Node = Editor | Element | Text;
export interface NodeAncestorsOptions {
    reverse?: boolean;
}
export interface NodeChildrenOptions {
    reverse?: boolean;
}
export interface NodeDescendantsOptions {
    from?: Path;
    to?: Path;
    reverse?: boolean;
    pass?: (node: NodeEntry) => boolean;
}
export interface NodeElementsOptions {
    from?: Path;
    to?: Path;
    reverse?: boolean;
    pass?: (node: NodeEntry) => boolean;
}
export interface NodeLevelsOptions {
    reverse?: boolean;
}
export interface NodeNodesOptions {
    from?: Path;
    to?: Path;
    reverse?: boolean;
    pass?: (entry: NodeEntry) => boolean;
}
export interface NodeTextsOptions {
    from?: Path;
    to?: Path;
    reverse?: boolean;
    pass?: (node: NodeEntry) => boolean;
}
export interface NodeInterface {
    /**
     * Get the node at a specific path, asserting that it's an ancestor node.
     */
    ancestor: (root: Node, path: Path) => Ancestor;
    /**
     * Return a generator of all the ancestor nodes above a specific path.
     *
     * By default the order is top-down, from highest to lowest ancestor in
     * the tree, but you can pass the `reverse: true` option to go bottom-up.
     */
    ancestors: (root: Node, path: Path, options?: NodeAncestorsOptions) => Generator<NodeEntry<Ancestor>, void, undefined>;
    /**
     * Get the child of a node at a specific index.
     */
    child: (root: Node, index: number) => Descendant;
    /**
     * Iterate over the children of a node at a specific path.
     */
    children: (root: Node, path: Path, options?: NodeChildrenOptions) => Generator<NodeEntry<Descendant>, void, undefined>;
    /**
     * Get an entry for the common ancesetor node of two paths.
     */
    common: (root: Node, path: Path, another: Path) => NodeEntry;
    /**
     * Get the node at a specific path, asserting that it's a descendant node.
     */
    descendant: (root: Node, path: Path) => Descendant;
    /**
     * Return a generator of all the descendant node entries inside a root node.
     */
    descendants: (root: Node, options?: NodeDescendantsOptions) => Generator<NodeEntry<Descendant>, void, undefined>;
    /**
     * Return a generator of all the element nodes inside a root node. Each iteration
     * will return an `ElementEntry` tuple consisting of `[Element, Path]`. If the
     * root node is an element it will be included in the iteration as well.
     */
    elements: (root: Node, options?: NodeElementsOptions) => Generator<ElementEntry, void, undefined>;
    /**
     * Extract props from a Node.
     */
    extractProps: (node: Node) => NodeProps;
    /**
     * Get the first node entry in a root node from a path.
     */
    first: (root: Node, path: Path) => NodeEntry;
    /**
     * Get the sliced fragment represented by a range inside a root node.
     */
    fragment: (root: Node, range: Range) => Descendant[];
    /**
     * Get the descendant node referred to by a specific path. If the path is an
     * empty array, it refers to the root node itself.
     */
    get: (root: Node, path: Path) => Node;
    /**
     * Check if a descendant node exists at a specific path.
     */
    has: (root: Node, path: Path) => boolean;
    /**
     * Check if a value implements the `Node` interface.
     */
    isNode: (value: any) => value is Node;
    /**
     * Check if a value is a list of `Node` objects.
     */
    isNodeList: (value: any) => value is Node[];
    /**
     * Get the last node entry in a root node from a path.
     */
    last: (root: Node, path: Path) => NodeEntry;
    /**
     * Get the node at a specific path, ensuring it's a leaf text node.
     */
    leaf: (root: Node, path: Path) => Text;
    /**
     * Return a generator of the in a branch of the tree, from a specific path.
     *
     * By default the order is top-down, from highest to lowest node in the tree,
     * but you can pass the `reverse: true` option to go bottom-up.
     */
    levels: (root: Node, path: Path, options?: NodeLevelsOptions) => Generator<NodeEntry, void, undefined>;
    /**
     * Check if a node matches a set of props.
     */
    matches: (node: Node, props: Partial<Node>) => boolean;
    /**
     * Return a generator of all the node entries of a root node. Each entry is
     * returned as a `[Node, Path]` tuple, with the path referring to the node's
     * position inside the root node.
     */
    nodes: (root: Node, options?: NodeNodesOptions) => Generator<NodeEntry, void, undefined>;
    /**
     * Get the parent of a node at a specific path.
     */
    parent: (root: Node, path: Path) => Ancestor;
    /**
     * Get the concatenated text string of a node's content.
     *
     * Note that this will not include spaces or line breaks between block nodes.
     * It is not a user-facing string, but a string for performing offset-related
     * computations for a node.
     */
    string: (node: Node) => string;
    /**
     * Return a generator of all leaf text nodes in a root node.
     */
    texts: (root: Node, options?: NodeTextsOptions) => Generator<NodeEntry<Text>, void, undefined>;
}
export declare const Node: NodeInterface;
/**
 * The `Descendant` union type represents nodes that are descendants in the
 * tree. It is returned as a convenience in certain cases to narrow a value
 * further than the more generic `Node` union.
 */
export type Descendant = Element | Text;
/**
 * The `Ancestor` union type represents nodes that are ancestors in the tree.
 * It is returned as a convenience in certain cases to narrow a value further
 * than the more generic `Node` union.
 */
export type Ancestor = Editor | Element;
/**
 * `NodeEntry` objects are returned when iterating over the nodes in a Slate
 * document tree. They consist of the node and its `Path` relative to the root
 * node in the document.
 */
export type NodeEntry<T extends Node = Node> = [T, Path];
/**
 * Convenience type for returning the props of a node.
 */
export type NodeProps = Omit<Editor, 'children'> | Omit<Element, 'children'> | Omit<Text, 'text'>;
//# sourceMappingURL=node.d.ts.map