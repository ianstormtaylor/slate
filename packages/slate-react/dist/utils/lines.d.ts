/**
 * Utilities for single-line deletion
 */
import { Range } from 'slate';
import { ReactEditor } from '../plugin/react-editor';
/**
 * A helper utility that returns the end portion of a `Range`
 * which is located on a single line.
 *
 * @param {Editor} editor The editor object to compare against
 * @param {Range} parentRange The parent range to compare against
 * @returns {Range} A valid portion of the parentRange which is one a single line
 */
export declare const findCurrentLineRange: (editor: ReactEditor, parentRange: Range) => Range;
//# sourceMappingURL=lines.d.ts.map