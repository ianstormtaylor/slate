import React from 'react';
import { Text, Element } from 'slate';
/**
 * Leaf content strings.
 */
declare const String: (props: {
    isLast: boolean;
    leaf: Text;
    parent: Element;
    text: Text;
}) => React.JSX.Element;
/**
 * Leaf strings without text, render as zero-width strings.
 */
export declare const ZeroWidthString: (props: {
    length?: number;
    isLineBreak?: boolean;
    isMarkPlaceholder?: boolean;
}) => React.JSX.Element;
export default String;
//# sourceMappingURL=string.d.ts.map