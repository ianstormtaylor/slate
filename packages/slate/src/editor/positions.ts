import { Editor, EditorPositionsOptions } from '../interfaces/editor'
import { Element } from '../interfaces/element'
import { Path } from '../interfaces/path'
import { Point } from '../interfaces/point'
import { Range } from '../interfaces/range'
import { Text } from '../interfaces/text'
import {
  getCharacterDistance,
  getWordDistance,
  splitByCharacterDistance,
} from '../utils/string'

export function* positions(
  editor: Editor,
  options: EditorPositionsOptions = {}
): Generator<Point, void, undefined> {
  const {
    at = editor.selection,
    unit = 'offset',
    reverse = false,
    voids = false,
    ignoreNonSelectable = false,
  } = options

  if (!at) {
    return
  }

  /**
   * Algorithm notes:
   *
   * Each step `distance` is dynamic depending on the underlying text
   * and the `unit` specified.  Each step, e.g., a line or word, may
   * span multiple text nodes, so we iterate through the text both on
   * two levels in step-sync:
   *
   * `leafText` stores the text on a text leaf level, and is advanced
   * through using the counters `leafTextOffset` and `leafTextRemaining`.
   *
   * `blockText` stores the text on a block level, and is shortened
   * by `distance` every time it is advanced.
   *
   * We only maintain a window of one blockText and one leafText because
   * a block node always appears before all of its leaf nodes.
   */

  const range = Editor.range(editor, at)
  if (!range) {
    return editor.onError({
      key: 'positions.range',
      message: 'Cannot get the range',
      data: { at },
    })
  }

  const [start, end] = Range.edges(range)
  const first = reverse ? end : start
  let isNewBlock = false
  let blockText = ''
  let distance = 0 // Distance for leafText to catch up to blockText.
  let leafTextRemaining = 0
  let leafTextOffset = 0

  // Iterate through all nodes in range, grabbing entire textual content
  // of block nodes in blockText, and text nodes in leafText.
  // Exploits the fact that nodes are sequenced in such a way that we first
  // encounter the block node, then all of its text nodes, so when iterating
  // through the blockText and leafText we just need to remember a window of
  // one block node and leaf node, respectively.
  for (const [node, path] of Editor.nodes(editor, {
    at,
    reverse,
    voids,
    ignoreNonSelectable,
  })) {
    /*
     * ELEMENT NODE - Yield position(s) for voids, collect blockText for blocks
     */
    if (Element.isElement(node)) {
      // Void nodes are a special case, so by default we will always
      // yield their first point. If the `voids` option is set to true,
      // then we will iterate over their content.
      if (!voids && (editor.isVoid(node) || editor.isElementReadOnly(node))) {
        const start = Editor.start(editor, path)
        if (!start) {
          editor.onError({
            key: 'positions.start',
            message: 'Cannot get the start point',
            data: { at },
          })
          continue
        }
        yield start
        continue
      }

      // Inline element nodes are ignored as they don't themselves
      // contribute to `blockText` or `leafText` - their parent and
      // children do.
      if (editor.isInline(node)) continue

      // Block element node - set `blockText` to its text content.
      if (Editor.hasInlines(editor, node)) {
        // We always exhaust block nodes before encountering a new one:
        //   console.assert(blockText === '',
        //     `blockText='${blockText}' - `+
        //     `not exhausted before new block node`, path)

        // Ensure range considered is capped to `range`, in the
        // start/end edge cases where block extends beyond range.
        // Equivalent to this, but presumably more performant:
        //   blockRange = Editor.range(editor, ...Editor.edges(editor, path))
        //   blockRange = Range.intersection(range, blockRange) // intersect
        //   blockText = Editor.string(editor, blockRange, { voids })
        const e = Path.isAncestor(path, end.path)
          ? end
          : Editor.end(editor, path)
        if (!e) {
          editor.onError({
            key: 'positions.end',
            message: 'Cannot get the end point',
            data: { at },
          })
          continue
        }

        const s = Path.isAncestor(path, start.path)
          ? start
          : Editor.start(editor, path)
        if (!s) {
          editor.onError({
            key: 'positions.start',
            message: 'Cannot get the start point',
            data: { at },
          })
          continue
        }

        blockText = Editor.string(editor, { anchor: s, focus: e }, { voids })
        isNewBlock = true
      }
    }

    /*
     * TEXT LEAF NODE - Iterate through text content, yielding
     * positions every `distance` offset according to `unit`.
     */
    if (Text.isText(node)) {
      const isFirst = Path.equals(path, first.path)

      // Proof that we always exhaust text nodes before encountering a new one:
      //   console.assert(leafTextRemaining <= 0,
      //     `leafTextRemaining=${leafTextRemaining} - `+
      //     `not exhausted before new leaf text node`, path)

      // Reset `leafText` counters for new text node.
      if (isFirst) {
        leafTextRemaining = reverse
          ? first.offset
          : node.text.length - first.offset
        leafTextOffset = first.offset // Works for reverse too.
      } else {
        leafTextRemaining = node.text.length
        leafTextOffset = reverse ? leafTextRemaining : 0
      }

      // Yield position at the start of node (potentially).
      if (isFirst || isNewBlock || unit === 'offset') {
        yield { path, offset: leafTextOffset }
        isNewBlock = false
      }

      // Yield positions every (dynamically calculated) `distance` offset.
      while (true) {
        // If `leafText` has caught up with `blockText` (distance=0),
        // and if blockText is exhausted, break to get another block node,
        // otherwise advance blockText forward by the new `distance`.
        if (distance === 0) {
          if (blockText === '') break
          distance = calcDistance(blockText, unit, reverse)
          // Split the string at the previously found distance and use the
          // remaining string for the next iteration.
          blockText = splitByCharacterDistance(blockText, distance, reverse)[1]
        }

        // Advance `leafText` by the current `distance`.
        leafTextOffset = reverse
          ? leafTextOffset - distance
          : leafTextOffset + distance
        leafTextRemaining = leafTextRemaining - distance

        // If `leafText` is exhausted, break to get a new leaf node
        // and set distance to the overflow amount, so we'll (maybe)
        // catch up to blockText in the next leaf text node.
        if (leafTextRemaining < 0) {
          distance = -leafTextRemaining
          break
        }

        // Successfully walked `distance` offsets through `leafText`
        // to catch up with `blockText`, so we can reset `distance`
        // and yield this position in this node.
        distance = 0
        yield { path, offset: leafTextOffset }
      }
    }
  }
  // Proof that upon completion, we've exahusted both leaf and block text:
  //   console.assert(leafTextRemaining <= 0, "leafText wasn't exhausted")
  //   console.assert(blockText === '', "blockText wasn't exhausted")

  // Helper:
  // Return the distance in offsets for a step of size `unit` on given string.
  function calcDistance(text: string, unit: string, reverse?: boolean) {
    if (unit === 'character') {
      return getCharacterDistance(text, reverse)
    } else if (unit === 'word') {
      return getWordDistance(text, reverse)
    } else if (unit === 'line' || unit === 'block') {
      return text.length
    }
    return 1
  }
}
