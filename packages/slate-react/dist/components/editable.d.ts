import React from 'react';
import { JSX } from 'react';
import { Element, NodeEntry, Range, Text } from 'slate';
import { ReactEditor } from '../plugin/react-editor';
import { DOMRange } from '../utils/dom';
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
export type EditableProps = {
    decorate?: (entry: NodeEntry) => Range[];
    onDOMBeforeInput?: (event: InputEvent) => void;
    placeholder?: string;
    readOnly?: boolean;
    role?: string;
    style?: React.CSSProperties;
    renderElement?: (props: RenderElementProps) => JSX.Element;
    renderLeaf?: (props: RenderLeafProps) => JSX.Element;
    renderPlaceholder?: (props: RenderPlaceholderProps) => JSX.Element;
    scrollSelectionIntoView?: (editor: ReactEditor, domRange: DOMRange) => void;
    as?: React.ElementType;
    disableDefaultStyles?: boolean;
} & React.TextareaHTMLAttributes<HTMLDivElement>;
/**
 * Editable.
 */
export declare const Editable: (props: EditableProps) => JSX.Element;
/**
 * The props that get passed to renderPlaceholder
 */
export type RenderPlaceholderProps = {
    children: any;
    attributes: {
        'data-slate-placeholder': boolean;
        dir?: 'rtl';
        contentEditable: boolean;
        ref: React.RefCallback<any>;
        style: React.CSSProperties;
    };
};
/**
 * The default placeholder element
 */
export declare const DefaultPlaceholder: ({ attributes, children, }: RenderPlaceholderProps) => JSX.Element;
/**
 * A default memoized decorate function.
 */
export declare const defaultDecorate: (entry: NodeEntry) => Range[];
/**
 * Check if an event is overrided by a handler.
 */
export declare const isEventHandled: <EventType extends React.SyntheticEvent<unknown, unknown>>(event: EventType, handler?: ((event: EventType) => void | boolean) | undefined) => boolean;
/**
 * Check if the event's target is an input element
 */
export declare const isDOMEventTargetInput: <EventType extends React.SyntheticEvent<unknown, unknown>>(event: EventType) => boolean;
/**
 * Check if a DOM event is overrided by a handler.
 */
export declare const isDOMEventHandled: <E extends Event>(event: E, handler?: ((event: E) => void | boolean) | undefined) => boolean;
//# sourceMappingURL=editable.d.ts.map