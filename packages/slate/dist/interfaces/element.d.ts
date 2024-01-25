import { Path, Descendant, ExtendedType, Ancestor } from '..';
/**
 * `Element` objects are a type of node in a Slate document that contain other
 * element nodes or text nodes. They can be either "blocks" or "inlines"
 * depending on the Slate editor's configuration.
 */
export interface BaseElement {
    children: Descendant[];
}
export declare type Element = ExtendedType<'Element', BaseElement>;
export interface ElementInterface {
    isAncestor: (value: any) => value is Ancestor;
    isElement: (value: any) => value is Element;
    isElementList: (value: any) => value is Element[];
    isElementProps: (props: any) => props is Partial<Element>;
    isElementType: <T extends Element>(value: any, elementVal: string, elementKey?: string) => value is T;
    matches: (element: Element, props: Partial<Element>) => boolean;
}
export declare const Element: ElementInterface;
/**
 * `ElementEntry` objects refer to an `Element` and the `Path` where it can be
 * found inside a root node.
 */
export declare type ElementEntry = [Element, Path];
//# sourceMappingURL=element.d.ts.map