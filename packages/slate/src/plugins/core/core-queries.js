import PathUtils from '../../utils/path-utils'
import TextUtils from '../../utils/text-utils'
import Queries from '../queries'

/**
 * A plugin that defines the core Slate query logic.
 *
 * @return {Object}
 */

function CoreQueriesPlugin() {
  return Queries({
    /**
     * By default, no formats are atomic in Slate.
     *
     * @param {Editor} editor
     * @param {Annotation|Decoration|Mark} object
     * @return {Boolean}
     */

    isAtomic() {
      return false
    },

    /**
     * By default, no nodes are void in Slate.
     *
     * @param {Editor} editor
     * @param {Node} node
     * @return {Boolean}
     */

    isVoid() {
      return false
    },

    /**
     * Calculate the next point forward from a `point`.
     *
     * @param {Editor} editor
     * @param {Point} point
     * @return {Point|Null}
     */

    getNextPoint(editor, point, options = {}) {
      const { allowZeroWidth = false } = options
      const { value } = editor
      const { document } = value
      const { path, offset } = point
      const closestBlock = document.closestBlock(path)
      const closestVoid = document.closest(path, editor.isVoid)
      const node = document.getNode(path)

      // PERF: if we're not in a void and we have offset to gain, do it easily.
      if (!closestVoid && offset < node.text.length) {
        const next = point.setOffset(offset + 1)
        return next.normalize(document)
      }

      for (const [nextNode, nextPath] of document.texts({ path })) {
        // If we're still inside the void node, keep going until we exit it.
        if (closestVoid) {
          const [, voidPath] = closestVoid

          if (!PathUtils.isAfter(nextPath, voidPath)) {
            continue
          }
        }

        // If we're no longer inside the original block node, we don't want to
        // add an extra `1` to the offset, since we've changed blocks. Instead
        // we move right to the start of the block.
        if (closestBlock) {
          const [, blockPath] = closestBlock

          if (PathUtils.isAfter(nextPath, blockPath)) {
            const next = point.moveTo(nextPath, 0)
            return next.normalize(document)
          }
        }

        // If the text node and we're still in the same block, continue onwards
        // because we need to have moved one point forwards, and an empty text
        // will be perceived as not moving.
        if (nextNode.text.length === 0) {
          if (allowZeroWidth) {
            const next = point.moveTo(nextPath, 0)
            return next.normalize(document)
          } else {
            continue
          }
        }

        const next = point.moveTo(nextPath, 1)
        return next.normalize(document)
      }

      return null
    },

    /**
     * Calculate the next character boundary from a `point`.
     *
     * @param {Editor} editor
     * @param {Point} point
     * @return {Point|Null}
     */

    getNextCharacterPoint(editor, point) {
      const { value: { document } } = editor
      const { path, offset } = point
      const [block, blockPath] = document.closestBlock(path)
      const relativePath = path.slice(blockPath.size)
      const blockOffset = block.getOffset(relativePath)
      const blockText = block.getText()

      if (blockOffset + offset === blockText.length) {
        return editor.getNextPoint(point)
      }

      const o = blockOffset + offset
      const n = TextUtils.getCharOffsetForward(blockText, o)
      let next = point

      for (let i = 0; i < n; i++) {
        next = editor.getNextPoint(next)

        if (!next) {
          break
        }
      }

      return next
    },

    /**
     * Get the next point in the document that is not inside a void node.
     *
     * @param {Editor} editor
     * @param {Point} point
     * @return {Point|Null}
     */

    getNextNonVoidPoint(editor, point) {
      const { value: { document } } = editor
      let next = point

      while (next) {
        const closestVoid = document.closest(next.path, editor.isVoid)

        if (closestVoid) {
          next = editor.getNextPoint(next, { allowZeroWidth: true })
        } else {
          return next
        }
      }
    },

    /**
     * Calculate the next word boundary from a `point`.
     *
     * @param {Editor} editor
     * @param {Point} point
     * @return {Point|Null}
     */

    getNextWordPoint(editor, point) {
      const { value: { document } } = editor
      const { path, offset } = point
      const [block, blockPath] = document.closestBlock(path)
      const relativePath = path.slice(blockPath.size)
      const blockOffset = block.getOffset(relativePath)
      const blockText = block.getText()

      if (blockOffset + offset === blockText.length) {
        return editor.getNextPoint(point)
      }

      const o = blockOffset + offset
      const n = TextUtils.getWordOffsetForward(blockText, o)
      let next = point

      for (let i = 0; i < n; i++) {
        next = editor.getNextPoint(next)

        if (!next) {
          break
        }
      }

      return next
    },

    /**
     * Calculate a non-hanging range from a `range`.
     *
     * @param {Editor} editor
     * @param {Range} range
     * @return {Range}
     */

    getNonHangingRange(editor, range) {
      const { value: { document } } = editor
      const { isExpanded, start, end } = range

      if (isExpanded && end.offset === 0 && !start.path.equals(end.path)) {
        const [prevText, prevPath] = document.previousText(end.path)
        const newEnd = end.moveTo(prevPath, prevText.text.length)
        const nonHanging = range.setEnd(newEnd)
        return nonHanging
      } else {
        return range
      }
    },

    /**
     * Calculate the previous point backward from a `point`.
     *
     * @param {Editor} editor
     * @param {Point} point
     * @return {Point|Null}
     */

    getPreviousPoint(editor, point, options = {}) {
      const { allowZeroWidth = false } = options
      const { value } = editor
      const { document } = value
      const { path, offset } = point
      const closestBlock = document.closestBlock(path)
      const closestVoid = document.closest(path, editor.isVoid)

      // PERF: if we're not in a void and we have offset to lose, do it easily.
      if (!closestVoid && offset > 0) {
        const prev = point.setOffset(offset - 1)
        return prev.normalize(document)
      }

      const iterable = document.texts({ path, direction: 'backward' })

      for (const [prevNode, prevPath] of iterable) {
        // If we're still inside the void node, keep going until we exit it.
        if (closestVoid) {
          const [, voidPath] = closestVoid

          if (!PathUtils.isBefore(prevPath, voidPath)) {
            continue
          }
        }

        // If we're no longer inside the original block node, we don't want to
        // remove an extra `1` from the offset, since we've changed blocks.
        // Instead we move right to the end of the block.
        if (closestBlock) {
          const [, blockPath] = closestBlock

          if (PathUtils.isBefore(prevPath, blockPath)) {
            const prev = point.moveTo(prevPath, prevNode.text.length)
            return prev.normalize(document)
          }
        }

        // If the text node and we're still in the same block, continue onwards
        // because we need to have moved one point backwards, and an empty text
        // will be perceived as not moving.
        if (prevNode.text.length === 0) {
          if (allowZeroWidth) {
            const prev = point.moveTo(prevPath, 0)
            return prev.normalize(document)
          } else {
            continue
          }
        }

        const prev = point.moveTo(prevPath, prevNode.text.length - 1)
        return prev.normalize(document)
      }

      return null
    },

    /**
     * Calculate the previous character boundary from a `point`.
     *
     * @param {Editor} editor
     * @param {Point} point
     * @return {Point|Null}
     */

    getPreviousCharacterPoint(editor, point) {
      const { value: { document } } = editor
      const { path, offset } = point
      const [block, blockPath] = document.closestBlock(path)
      const relativePath = path.slice(blockPath.size)
      const blockOffset = block.getOffset(relativePath)

      if (blockOffset + offset === 0) {
        return editor.getPreviousPoint(point)
      }

      const blockText = block.getText()
      const o = blockOffset + offset
      const n = TextUtils.getCharOffsetBackward(blockText, o)
      let prev = point

      for (let i = 0; i < n; i++) {
        prev = editor.getPreviousPoint(prev)

        if (!prev) {
          break
        }
      }

      return prev
    },

    /**
     * Get the previous point in the document that is not inside a void node.
     *
     * @param {Editor} editor
     * @param {Point} point
     * @return {Point|Null}
     */

    getPreviousNonVoidPoint(editor, point) {
      const { value: { document } } = editor
      let prev = point

      while (prev) {
        const closestVoid = document.closest(prev.path, editor.isVoid)

        if (closestVoid) {
          prev = editor.getPreviousPoint(prev, { allowZeroWidth: true })
        } else {
          return prev
        }
      }
    },

    /**
     * Calculate the previous word boundary from a `point`.
     *
     * @param {Editor} editor
     * @param {Point} point
     * @return {Point|Null}
     */

    getPreviousWordPoint(editor, point) {
      const { value: { document } } = editor
      const { path, offset } = point
      const [block, blockPath] = document.closestBlock(path)
      const relativePath = path.slice(blockPath.size)
      const blockOffset = block.getOffset(relativePath)

      if (blockOffset + offset === 0) {
        return editor.getPreviousPoint(point)
      }

      const blockText = block.getText()
      const o = blockOffset + offset
      const n = TextUtils.getWordOffsetBackward(blockText, o)
      let prev = point

      for (let i = 0; i < n; i++) {
        prev = editor.getPreviousPoint(prev)

        if (!prev) {
          break
        }
      }

      return prev
    },
  })
}

/**
 * Export.
 *
 * @type {Object}
 */

export default CoreQueriesPlugin
