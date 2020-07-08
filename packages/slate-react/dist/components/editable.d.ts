import React from 'react';
import { Element, NodeEntry, Range, Text } from 'slate';
/**
 * `RenderElementProps` are passed to the `renderElement` handler.
 */
export interface RenderElementProps {
    children: any;
    element: Element;
    attributes: {
        'data-slate-node': 'element';
        'data-slate-inline'?: true;
        'data-slate-void'?: true;
        dir?: 'rtl';
        ref: any;
    };
}
/**
 * `RenderLeafProps` are passed to the `renderLeaf` handler.
 */
export interface RenderLeafProps {
    children: any;
    leaf: Text;
    text: Text;
    attributes: {
        'data-slate-leaf': true;
    };
}
/**
 * `EditableProps` are passed to the `<Editable>` component.
 */
export declare type EditableProps = {
    decorate?: (entry: NodeEntry) => Range[];
    onDOMBeforeInput?: (event: Event) => void;
    placeholder?: string;
    readOnly?: boolean;
    role?: string;
    style?: React.CSSProperties;
    renderElement?: (props: RenderElementProps) => JSX.Element;
    renderLeaf?: (props: RenderLeafProps) => JSX.Element;
    as?: React.ElementType;
} & React.TextareaHTMLAttributes<HTMLDivElement>;
/**
 * Editable.
 */
export declare const Editable: (props: EditableProps) => JSX.Element;
//# sourceMappingURL=editable.d.ts.map