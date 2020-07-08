import React from 'react';
import { Range, Element, Text as SlateText } from 'slate';
import { RenderLeafProps } from './editable';
declare const MemoizedText: React.MemoExoticComponent<(props: {
    decorations: Range[];
    isLast: boolean;
    parent: Element;
    renderLeaf?: ((props: RenderLeafProps) => JSX.Element) | undefined;
    text: SlateText;
}) => JSX.Element>;
export default MemoizedText;
//# sourceMappingURL=text.d.ts.map