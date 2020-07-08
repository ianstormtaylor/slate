import { createAnchor, createCursor, createEditor, createElement, createFocus, createFragment, createSelection, createText } from './creators';
/**
 * `HyperscriptCreators` are dictionaries of `HyperscriptCreator` functions
 * keyed by tag name.
 */
declare type HyperscriptCreators<T = any> = Record<string, (tagName: string, attributes: {
    [key: string]: any;
}, children: any[]) => T>;
/**
 * `HyperscriptShorthands` are dictionaries of properties applied to specific
 * kind of object, keyed by tag name. They allow you to easily define custom
 * hyperscript tags for your domain.
 */
declare type HyperscriptShorthands = Record<string, Record<string, any>>;
/**
 * Create a Slate hyperscript function with `options`.
 */
declare const createHyperscript: (options?: {
    creators?: Record<string, (tagName: string, attributes: {
        [key: string]: any;
    }, children: any[]) => any> | undefined;
    elements?: Record<string, Record<string, any>> | undefined;
}) => <S extends "element" | "anchor" | "cursor" | "editor" | "focus" | "fragment" | "selection" | "text">(tagName: S, attributes?: Object | undefined, ...children: any[]) => ReturnType<({
    anchor: typeof createAnchor;
    cursor: typeof createCursor;
    editor: typeof createEditor;
    element: typeof createElement;
    focus: typeof createFocus;
    fragment: typeof createFragment;
    selection: typeof createSelection;
    text: typeof createText;
} | {
    anchor: typeof createAnchor;
    cursor: typeof createCursor;
    editor: typeof createEditor;
    element: typeof createElement;
    focus: typeof createFocus;
    fragment: typeof createFragment;
    selection: typeof createSelection;
    text: typeof createText;
})[S]>;
export { createHyperscript, HyperscriptCreators, HyperscriptShorthands };
//# sourceMappingURL=hyperscript.d.ts.map