import React from 'react';
import { Node } from 'slate';
import { ReactEditor } from '../plugin/react-editor';
/**
 * A wrapper around the provider to handle `onChange` events, because the editor
 * is a mutable singleton so it won't ever register as "changed" otherwise.
 */
export declare const Slate: (props: {
    [key: string]: unknown;
    editor: ReactEditor;
    value: Node[];
    children: React.ReactNode;
    onChange: (value: Node[]) => void;
}) => JSX.Element;
//# sourceMappingURL=slate.d.ts.map