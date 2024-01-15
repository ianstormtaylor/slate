/**
 * Get the distance to the end of the first character in a string of text.
 */
export declare const getCharacterDistance: (str: string, isRTL?: boolean) => number;
/**
 * Get the distance to the end of the first word in a string of text.
 */
export declare const getWordDistance: (text: string, isRTL?: boolean) => number;
/**
 * Split a string in two parts at a given distance starting from the end when
 * `isRTL` is set to `true`.
 */
export declare const splitByCharacterDistance: (str: string, dist: number, isRTL?: boolean) => [string, string];
/**
 * Iterate on codepoints from right to left.
 */
export declare const codepointsIteratorRTL: (str: string) => Generator<string, void, unknown>;
//# sourceMappingURL=string.d.ts.map