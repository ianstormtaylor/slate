/**
 * Types.
 */
import DOMNode = globalThis.Node;
import DOMComment = globalThis.Comment;
import DOMElement = globalThis.Element;
import DOMText = globalThis.Text;
import DOMRange = globalThis.Range;
import DOMSelection = globalThis.Selection;
import DOMStaticRange = globalThis.StaticRange;
export { DOMNode, DOMComment, DOMElement, DOMText, DOMRange, DOMSelection, DOMStaticRange, };
declare global {
    interface Window {
        Selection: typeof Selection['constructor'];
        DataTransfer: typeof DataTransfer['constructor'];
        Node: typeof Node['constructor'];
    }
}
export declare type DOMPoint = [Node, number];
/**
 * Returns the host window of a DOM node
 */
export declare const getDefaultView: (value: any) => Window | null;
/**
 * Check if a DOM node is a comment node.
 */
export declare const isDOMComment: (value: any) => value is DOMComment;
/**
 * Check if a DOM node is an element node.
 */
export declare const isDOMElement: (value: any) => value is DOMElement;
/**
 * Check if a value is a DOM node.
 */
export declare const isDOMNode: (value: any) => value is DOMNode;
/**
 * Check if a value is a DOM selection.
 */
export declare const isDOMSelection: (value: any) => value is DOMSelection;
/**
 * Check if a DOM node is an element node.
 */
export declare const isDOMText: (value: any) => value is DOMText;
/**
 * Checks whether a paste event is a plaintext-only event.
 */
export declare const isPlainTextOnlyPaste: (event: ClipboardEvent) => boolean | null;
/**
 * Normalize a DOM point so that it always refers to a text node.
 */
export declare const normalizeDOMPoint: (domPoint: DOMPoint) => DOMPoint;
/**
 * Determines wether the active element is nested within a shadowRoot
 */
export declare const hasShadowRoot: () => boolean;
/**
 * Get the nearest editable child and index at `index` in a `parent`, preferring
 * `direction`.
 */
export declare const getEditableChildAndIndex: (parent: DOMElement, index: number, direction: 'forward' | 'backward') => [DOMNode, number];
/**
 * Get the nearest editable child at `index` in a `parent`, preferring
 * `direction`.
 */
export declare const getEditableChild: (parent: DOMElement, index: number, direction: 'forward' | 'backward') => DOMNode;
/**
 * Get a plaintext representation of the content of a node, accounting for block
 * elements which get a newline appended.
 *
 * The domNode must be attached to the DOM.
 */
export declare const getPlainText: (domNode: DOMNode) => string;
export declare const getSlateFragmentAttribute: (dataTransfer: DataTransfer) => string | void;
/**
 * Get the x-slate-fragment attribute that exist in text/html data
 * and append it to the DataTransfer object
 */
export declare const getClipboardData: (dataTransfer: DataTransfer) => DataTransfer;
//# sourceMappingURL=dom.d.ts.map