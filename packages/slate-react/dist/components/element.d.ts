import React from 'react';
import { Range, Element as SlateElement } from 'slate';
import { RenderElementProps, RenderLeafProps, RenderPlaceholderProps } from './editable';
/**
 * Element.
 */
declare const Element: (props: {
    decorations: Range[];
    element: SlateElement;
    renderElement?: ((props: RenderElementProps) => JSX.Element) | undefined;
    renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element;
    renderLeaf?: ((props: RenderLeafProps) => JSX.Element) | undefined;
    selection: Range | null;
}) => JSX.Element;
declare const MemoizedElement: React.MemoExoticComponent<(props: {
    decorations: Range[];
    element: SlateElement;
    renderElement?: ((props: RenderElementProps) => JSX.Element) | undefined;
    renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element;
    renderLeaf?: ((props: RenderLeafProps) => JSX.Element) | undefined;
    selection: Range | null;
}) => JSX.Element>;
/**
 * The default element renderer.
 */
export declare const DefaultElement: (props: RenderElementProps) => JSX.Element;
export default MemoizedElement;
//# sourceMappingURL=element.d.ts.map