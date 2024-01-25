import { Range } from '..';
import { ExtendedType } from './custom-types';
/**
 * `Text` objects represent the nodes that contain the actual text content of a
 * Slate document along with any formatting properties. They are always leaf
 * nodes in the document tree as they cannot contain any children.
 */
export interface BaseText {
    text: string;
}
export declare type Text = ExtendedType<'Text', BaseText>;
export interface TextEqualsOptions {
    loose?: boolean;
}
export interface TextInterface {
    equals: (text: Text, another: Text, options?: TextEqualsOptions) => boolean;
    isText: (value: any) => value is Text;
    isTextList: (value: any) => value is Text[];
    isTextProps: (props: any) => props is Partial<Text>;
    matches: (text: Text, props: Partial<Text>) => boolean;
    decorations: (node: Text, decorations: Range[]) => Text[];
}
export declare const Text: TextInterface;
//# sourceMappingURL=text.d.ts.map