import React from 'react';
import { Descendant } from 'slate';
import { ReactEditor } from '../plugin/react-editor';
/**
 * A wrapper around the provider to handle `onChange` events, because the editor
 * is a mutable singleton so it won't ever register as "changed" otherwise.
 */
export declare const Slate: (props: {
    editor: ReactEditor;
    value: Descendant[];
    children: React.ReactNode;
    onChange?: ((value: Descendant[]) => void) | undefined;
}) => JSX.Element;
//# sourceMappingURL=slate.d.ts.map