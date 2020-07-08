import { Range, NodeEntry, Ancestor } from 'slate';
import { RenderElementProps, RenderLeafProps } from './editable';
/**
 * Children.
 */
declare const Children: (props: {
    decorate: (entry: NodeEntry<import("slate").Node>) => Range[];
    decorations: Range[];
    node: Ancestor;
    renderElement?: ((props: RenderElementProps) => JSX.Element) | undefined;
    renderLeaf?: ((props: RenderLeafProps) => JSX.Element) | undefined;
    selection: Range | null;
}) => JSX.Element;
export default Children;
//# sourceMappingURL=children.d.ts.map