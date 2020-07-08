import { Range } from '..';
/**
 * `Text` objects represent the nodes that contain the actual text content of a
 * Slate document along with any formatting properties. They are always leaf
 * nodes in the document tree as they cannot contain any children.
 */
export interface Text {
    text: string;
    [key: string]: unknown;
}
export declare const Text: {
    /**
     * Check if two text nodes are equal.
     */
    equals(text: Text, another: Text, options?: {
        loose?: boolean | undefined;
    }): boolean;
    /**
     * Check if a value implements the `Text` interface.
     */
    isText(value: any): value is Text;
    /**
     * Check if a value is a list of `Text` objects.
     */
    isTextList(value: any): value is Text[];
    /**
     * Check if an text matches set of properties.
     *
     * Note: this is for matching custom properties, and it does not ensure that
     * the `text` property are two nodes equal.
     */
    matches(text: Text, props: Partial<Text>): boolean;
    /**
     * Get the leaves for a text node given decorations.
     */
    decorations(node: Text, decorations: Range[]): Text[];
};
//# sourceMappingURL=text.d.ts.map