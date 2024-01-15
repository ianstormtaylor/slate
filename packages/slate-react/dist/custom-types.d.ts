import { BaseRange, BaseText } from 'slate';
import { ReactEditor } from './plugin/react-editor';
declare module 'slate' {
    interface CustomTypes {
        Editor: ReactEditor;
        Text: BaseText & {
            placeholder?: string;
            onPlaceholderResize?: (node: HTMLElement | null) => void;
            [key: string]: unknown;
        };
        Range: BaseRange & {
            placeholder?: string;
            onPlaceholderResize?: (node: HTMLElement | null) => void;
            [key: string]: unknown;
        };
    }
}
declare global {
    interface Window {
        MSStream: boolean;
    }
    interface DocumentOrShadowRoot {
        getSelection(): Selection | null;
    }
    interface CaretPosition {
        readonly offsetNode: Node;
        readonly offset: number;
        getClientRect(): DOMRect | null;
    }
    interface Document {
        caretPositionFromPoint(x: number, y: number): CaretPosition | null;
    }
    interface Node {
        getRootNode(options?: GetRootNodeOptions): Document | ShadowRoot;
    }
}
export {};
//# sourceMappingURL=custom-types.d.ts.map