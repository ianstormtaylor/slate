import React from 'react';
import { Element, Range, Text as SlateText } from 'slate';
import { RenderLeafProps, RenderPlaceholderProps } from './editable';
declare const MemoizedText: React.MemoExoticComponent<(props: {
    decorations: Range[];
    isLast: boolean;
    parent: Element;
    renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element;
    renderLeaf?: ((props: RenderLeafProps) => JSX.Element) | undefined;
    text: SlateText;
}) => React.JSX.Element>;
export default MemoizedText;
//# sourceMappingURL=text.d.ts.map