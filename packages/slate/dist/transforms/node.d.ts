import { Editor, Element, Location, Node, Path } from '..';
import { NodeMatch, PropsCompare, PropsMerge } from '../interfaces/editor';
import { RangeMode, MaximizeMode } from '../interfaces/types';
export interface NodeTransforms {
    insertNodes: <T extends Node>(editor: Editor, nodes: Node | Node[], options?: {
        at?: Location;
        match?: NodeMatch<T>;
        mode?: RangeMode;
        hanging?: boolean;
        select?: boolean;
        voids?: boolean;
    }) => void;
    liftNodes: <T extends Node>(editor: Editor, options?: {
        at?: Location;
        match?: NodeMatch<T>;
        mode?: MaximizeMode;
        voids?: boolean;
    }) => void;
    mergeNodes: <T extends Node>(editor: Editor, options?: {
        at?: Location;
        match?: NodeMatch<T>;
        mode?: RangeMode;
        hanging?: boolean;
        voids?: boolean;
    }) => void;
    moveNodes: <T extends Node>(editor: Editor, options: {
        at?: Location;
        match?: NodeMatch<T>;
        mode?: MaximizeMode;
        to: Path;
        voids?: boolean;
    }) => void;
    removeNodes: <T extends Node>(editor: Editor, options?: {
        at?: Location;
        match?: NodeMatch<T>;
        mode?: RangeMode;
        hanging?: boolean;
        voids?: boolean;
    }) => void;
    setNodes: <T extends Node>(editor: Editor, props: Partial<T>, options?: {
        at?: Location;
        match?: NodeMatch<T>;
        mode?: MaximizeMode;
        hanging?: boolean;
        split?: boolean;
        voids?: boolean;
        compare?: PropsCompare;
        merge?: PropsMerge;
    }) => void;
    splitNodes: <T extends Node>(editor: Editor, options?: {
        at?: Location;
        match?: NodeMatch<T>;
        mode?: RangeMode;
        always?: boolean;
        height?: number;
        voids?: boolean;
    }) => void;
    unsetNodes: <T extends Node>(editor: Editor, props: string | string[], options?: {
        at?: Location;
        match?: NodeMatch<T>;
        mode?: MaximizeMode;
        split?: boolean;
        voids?: boolean;
    }) => void;
    unwrapNodes: <T extends Node>(editor: Editor, options?: {
        at?: Location;
        match?: NodeMatch<T>;
        mode?: MaximizeMode;
        split?: boolean;
        voids?: boolean;
    }) => void;
    wrapNodes: <T extends Node>(editor: Editor, element: Element, options?: {
        at?: Location;
        match?: NodeMatch<T>;
        mode?: MaximizeMode;
        split?: boolean;
        voids?: boolean;
    }) => void;
}
export declare const NodeTransforms: NodeTransforms;
//# sourceMappingURL=node.d.ts.map