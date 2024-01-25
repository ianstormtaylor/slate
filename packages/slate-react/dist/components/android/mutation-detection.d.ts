import { Editor } from 'slate';
import { DOMNode } from '../../utils/dom';
import { TextInsertion } from './diff-text';
interface MutationData {
    addedNodes: DOMNode[];
    removedNodes: DOMNode[];
    insertedText: TextInsertion[];
    characterDataMutations: MutationRecord[];
}
declare type MutationDetection = (editor: Editor, mutationData: MutationData) => boolean;
export declare function gatherMutationData(editor: Editor, mutations: MutationRecord[]): MutationData;
/**
 * In general, when a line break occurs, there will be more `addedNodes` than `removedNodes`.
 *
 * This isn't always the case however. In some cases, there will be more `removedNodes` than
 * `addedNodes`.
 *
 * To account for these edge cases, the most reliable strategy to detect line break mutations
 * is to check whether a new block was inserted of the same type as the current block.
 */
export declare const isLineBreak: MutationDetection;
/**
 * So long as we check for line break mutations before deletion mutations,
 * we can safely assume that a set of mutations was a deletion if there are
 * removed nodes.
 */
export declare const isDeletion: MutationDetection;
/**
 * If the selection was expanded and there are removed nodes,
 * the contents of the selection need to be replaced with the diff
 */
export declare const isReplaceExpandedSelection: MutationDetection;
/**
 * Plain text insertion
 */
export declare const isTextInsertion: MutationDetection;
/**
 * Edge case. Detect mutations that remove leaf nodes and also update character data
 */
export declare const isRemoveLeafNodes: MutationDetection;
export {};
//# sourceMappingURL=mutation-detection.d.ts.map