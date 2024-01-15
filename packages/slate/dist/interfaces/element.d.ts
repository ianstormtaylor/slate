import { Ancestor, Descendant, ExtendedType, Path } from '..';
/**
 * `Element` objects are a type of node in a Slate document that contain other
 * element nodes or text nodes. They can be either "blocks" or "inlines"
 * depending on the Slate editor's configuration.
 */
export interface BaseElement {
    children: Descendant[];
}
export type Element = ExtendedType<'Element', BaseElement>;
export interface ElementInterface {
    /**
     * Check if a value implements the 'Ancestor' interface.
     */
    isAncestor: (value: any) => value is Ancestor;
    /**
     * Check if a value implements the `Element` interface.
     */
    isElement: (value: any) => value is Element;
    /**
     * Check if a value is an array of `Element` objects.
     */
    isElementList: (value: any) => value is Element[];
    /**
     * Check if a set of props is a partial of Element.
     */
    isElementProps: (props: any) => props is Partial<Element>;
    /**
     * Check if a value implements the `Element` interface and has elementKey with selected value.
     * Default it check to `type` key value
     */
    isElementType: <T extends Element>(value: any, elementVal: string, elementKey?: string) => value is T;
    /**
     * Check if an element matches set of properties.
     *
     * Note: this checks custom properties, and it does not ensure that any
     * children are equivalent.
     */
    matches: (element: Element, props: Partial<Element>) => boolean;
}
export declare const Element: ElementInterface;
/**
 * `ElementEntry` objects refer to an `Element` and the `Path` where it can be
 * found inside a root node.
 */
export type ElementEntry = [Element, Path];
//# sourceMappingURL=element.d.ts.map