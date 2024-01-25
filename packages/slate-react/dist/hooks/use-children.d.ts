/// <reference types="react" />
import { Range, Element, Ancestor } from 'slate';
import { RenderElementProps, RenderLeafProps, RenderPlaceholderProps } from '../components/editable';
/**
 * Children.
 */
declare const useChildren: (props: {
    decorations: Range[];
    node: Ancestor;
    renderElement?: ((props: RenderElementProps) => JSX.Element) | undefined;
    renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element;
    renderLeaf?: ((props: RenderLeafProps) => JSX.Element) | undefined;
    selection: Range | null;
}) => JSX.Element[];
export default useChildren;
//# sourceMappingURL=use-children.d.ts.map