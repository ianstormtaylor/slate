import React from 'react';
import { Descendant, Selection } from 'slate';
import { ReactEditor } from '../plugin/react-editor';
/**
 * A wrapper around the provider to handle `onChange` events, because the editor
 * is a mutable singleton so it won't ever register as "changed" otherwise.
 */
export declare const Slate: (props: {
    editor: ReactEditor;
    initialValue: Descendant[];
    children: React.ReactNode;
    onChange?: ((value: Descendant[]) => void) | undefined;
    onSelectionChange?: ((selection: Selection) => void) | undefined;
    onValueChange?: ((value: Descendant[]) => void) | undefined;
}) => React.JSX.Element;
//# sourceMappingURL=slate.d.ts.map