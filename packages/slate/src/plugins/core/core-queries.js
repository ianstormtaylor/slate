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

    getNextPoint(editor, point) {
      const { value } = editor
      const { document } = value
      const { path, offset } = point
      const closestBlock = document.closestBlock(path)
      const closestVoid = document.closest(path, editor.isVoid)
      const node = document.getNode(path)

      // PERF: if we're not in a void and we have offset to gain, do it easily.
      if (!closestVoid && offset < node.text.length) {
        return point.setOffset(offset + 1)
      }

      for (const [, nextPath] of document.nextTexts({ path })) {
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
            return point.moveTo(nextPath, 0)
          }
        }

        return point.moveTo(nextPath, 1)
      }

      return null
    },

    /**
     * Calculate the next word boundary from a `point`.
     *
     * @param {Editor} editor
     * @param {Point} point
     * @return {Point}
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
      }

      return next
    },

    /**
     * Calculate the previous point backward from a `point`.
     *
     * @param {Editor} editor
     * @param {Point} point
     * @return {Point|Null}
     */

    getPreviousPoint(editor, point) {
      const { value } = editor
      const { document } = value
      const { path, offset } = point
      const closestBlock = document.closestBlock(path)
      const closestVoid = document.closest(path, editor.isVoid)

      // PERF: if we're not in a void and we have offset to lose, do it easily.
      if (!closestVoid && offset > 0) {
        return point.setOffset(offset - 1)
      }

      for (const [prevNode, prevPath] of document.previousTexts({ path })) {
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
            return point.moveTo(prevPath, prevNode.text.length)
          }
        }

        return point.moveTo(prevPath, prevNode.text.length - 1)
      }

      return null
    },

    /**
     * Calculate the previous word boundary from a `point`.
     *
     * @param {Editor} editor
     * @param {Point} point
     * @return {Point}
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
