import { GeneralTransforms } from './general'
import { NodeTransforms } from './node'
import { SelectionTransforms } from './selection'
import { TextTransforms } from './text'

export { InsertFragmentFilter, InsertFragmentFilterOptions } from './text'
export { NodeInsertNodesOptions } from './node'
export {
  SelectionCollapseOptions,
  SelectionMoveOptions,
  SelectionSetPointOptions,
} from './selection'
export {
  TextDeleteOptions,
  TextInsertFragmentOptions,
  TextInsertTextOptions,
} from './text'

/**
 * ## Selecting transform results
 *
 * `insertNodes`, `insertFragment`, `insertText`, `splitNodes`, `moveNodes` and `liftNodes` accept `select?: boolean`. Use `select: true` to move the caret to the result even when supplying an explicit `at`:
 *
 * ```js
 * Transforms.insertText(editor, 'hello', {
 *   at: { path: [1, 0], offset: 0 },
 *   select: true,
 * })
 * ```
 *
 * Insertions select the end of the inserted content. Splitting selects the start of the new content after the split. Moving or lifting selects the end of the last moved node. Insertion and splitting select by default only when `at` is omitted. `moveNodes` and `liftNodes` preserve their existing default: the selection follows moved content, keeping its offsets and direction, without explicitly selecting the end.
 *
 * With `select: false`, these transforms do not explicitly select their result. The existing selection is still transformed by operations, so its paths and offsets can change when content moves or text is inserted. An explicit `at` without `select: true` leaves an unrelated selection in place.
 *
 * Other transforms retain their existing selection behavior; property changes and wrapping, unwrapping, merging or removing nodes do not gain a new result-selection option.
 *
 * `insertText` preserves a null selection by default; use `select: true` to create a caret after inserting into an unfocused document.
 *
 */
export interface TransformsInterface
  extends GeneralTransforms,
    NodeTransforms,
    SelectionTransforms,
    TextTransforms {}

export const Transforms: TransformsInterface = {
  ...GeneralTransforms,
  ...NodeTransforms,
  ...SelectionTransforms,
  ...TextTransforms,
}
