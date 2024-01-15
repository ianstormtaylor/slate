import { Range } from '..';
import { ExtendedType } from '../types/custom-types';
/**
 * `Text` objects represent the nodes that contain the actual text content of a
 * Slate document along with any formatting properties. They are always leaf
 * nodes in the document tree as they cannot contain any children.
 */
export interface BaseText {
    text: string;
}
export type Text = ExtendedType<'Text', BaseText>;
export interface TextEqualsOptions {
    loose?: boolean;
}
export interface TextInterface {
    /**
     * Check if two text nodes are equal.
     *
     * When loose is set, the text is not compared. This is
     * used to check whether sibling text nodes can be merged.
     */
    equals: (text: Text, another: Text, options?: TextEqualsOptions) => boolean;
    /**
     * Check if a value implements the `Text` interface.
     */
    isText: (value: any) => value is Text;
    /**
     * Check if a value is a list of `Text` objects.
     */
    isTextList: (value: any) => value is Text[];
    /**
     * Check if some props are a partial of Text.
     */
    isTextProps: (props: any) => props is Partial<Text>;
    /**
     * Check if an text matches set of properties.
     *
     * Note: this is for matching custom properties, and it does not ensure that
     * the `text` property are two nodes equal.
     */
    matches: (text: Text, props: Partial<Text>) => boolean;
    /**
     * Get the leaves for a text node given decorations.
     */
    decorations: (node: Text, decorations: Range[]) => Text[];
}
export declare const Text: TextInterface;
//# sourceMappingURL=text.d.ts.map