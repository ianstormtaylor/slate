import { Node, Path } from '..';
/**
 * `Element` objects are a type of node in a Slate document that contain other
 * element nodes or text nodes. They can be either "blocks" or "inlines"
 * depending on the Slate editor's configuration.
 */
export interface Element {
    children: Node[];
    [key: string]: unknown;
}
export declare const Element: {
    /**
     * Check if a value implements the `Element` interface.
     */
    isElement(value: any): value is Element;
    /**
     * Check if a value is an array of `Element` objects.
     */
    isElementList(value: any): value is Element[];
    /**
     * Check if an element matches set of properties.
     *
     * Note: this checks custom properties, and it does not ensure that any
     * children are equivalent.
     */
    matches(element: Element, props: Partial<Element>): boolean;
};
/**
 * `ElementEntry` objects refer to an `Element` and the `Path` where it can be
 * found inside a root node.
 */
export declare type ElementEntry = [Element, Path];
//# sourceMappingURL=element.d.ts.map