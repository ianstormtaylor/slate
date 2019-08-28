import Range from '../../models/range'
import PathUtils from '../../utils/path-utils'
import TextUtils from '../../utils/text-utils'

/**
 * A plugin that defines the core Slate query logic.
 *
 * @return {Object}
 */

function CoreQueriesPlugin() {
  return {
    /**
     * Check whether a `format` is atomic, defaults to false.
     *
     * @param {Annotation|Decoration|Mark} format
     * @return {Boolean}
     */

    isAtomic: (fn, editor) => () => {
      return false
    },

    /**
     * Check whether a `range` is hanging.
     *
     * @param {Range} range
     * @return {Boolean}
     */

    isHanging: (fn, editor) => range => {
      const { isExpanded, start, end } = range
      return isExpanded && end.offset === 0 && !start.path.equals(end.path)
    },

    isHangingBlock: (fn, editor) => range => {
      const { value: { document } } = editor
      const { isExpanded, start, end } = range
      const [, endBlockPath] = document.closestBlock(end.path)
      const [, firstTextPath] = document.firstText({ path: endBlockPath })

      return (
        isExpanded &&
        end.offset === 0 &&
        !start.path.equals(end.path) &&
        end.path.equals(firstTextPath)
      )
    },

    isAtStartOfBlock: (fn, editor) => point => {
      const { value: { document } } = editor
      const [, blockPath] = document.closestBlock(point.path)
      const [, firstTextPath] = document.firstText({ path: blockPath })
      return point.offset === 0 && point.path.equals(firstTextPath)
    },

    isAtStartOfPath: (fn, editor) => (point, path) => {
      const { value: { document } } = editor
      const [, firstPath] = document.firstText({ path })
      return point.offset === 0 && point.path.equals(firstPath)
    },

    isAtEndOfPath: (fn, editor) => (point, path) => {
      const { value: { document } } = editor
      const [firstNode, firstPath] = document.firstText({ path })
      return (
        point.offset === firstNode.text.length && point.path.equals(firstPath)
      )
    },

    isAtEdgeOfPath: (fn, editor) => (point, path) => {
      return (
        editor.isAtStartOfPath(point, path) || editor.isAtEndOfPath(point, path)
      )
    },

    getPointAtStartOfPath: (fn, editor) => path => {
      const { value: { document } } = editor
      const [, firstPath] = document.firstText({ path })
      const point = document.createPoint({ path: firstPath, offset: 0 })
      return point
    },

    getPointAtEndOfPath: (fn, editor) => path => {
      const { value: { document } } = editor
      const [lastNode, lastPath] = document.lastText({ path })
      const point = document.createPoint({
        path: lastPath,
        offset: lastNode.text.length,
      })

      return point
    },

    getRangeAtEndOfPath: (fn, editor) => path => {
      const { value: { document } } = editor
      const point = editor.getPointAtEndOfPath(path)
      const range = document.createRange({ anchor: point, focus: point })
      return range
    },

    createPoint: (fn, editor) => props => {
      const { value: { document } } = editor
      const point = document.createPoint(props)
      return point
    },

    /**
     * Check whether a `node` is void, defaults to false.
     *
     * @param {Node} node
     * @return {Boolean}
     */

    isVoid: (fn, editor) => () => {
      return false
    },

    getFirstPoint: (fn, editor) => path => {
      const { value: { document } } = editor
      const [firstText, firstPath] = document.firstText({ path })
      const firstPoint = document.createPoint({
        key: firstText.key,
        path: firstPath,
        offset: 0,
      })

      return firstPoint
    },

    getLastPoint: (fn, editor) => path => {
      const { value: { document } } = editor
      const [lastText, lastPath] = document.lastText({ path })
      const lastPoint = document.createPoint({
        key: lastText.key,
        path: lastPath,
        offset: lastText.text.length,
      })

      return lastPoint
    },

    getRange: (fn, editor) => path => {
      const anchor = editor.getFirstPoint(path)
      const focus = editor.getLastPoint(path)
      const range = Range.create({ anchor, focus })
      return range
    },

    /**
     * Calculate the next point forward from a `point`.
     *
     * @param {Point} point
     * @return {Point|Null}
     */

    getNextPoint: (fn, editor) => (point, options = {}) => {
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

        // If the point is now inside a new void node, no matter if the void
        // node is zero-width, we still count it as a new point.
        const nextClosestVoid = document.closest(nextPath, editor.isVoid)

        // If the text node and we're still in the same block, continue onwards
        // because we need to have moved one point forwards, and an empty text
        // will be perceived as not moving.
        if (nextNode.text.length === 0) {
          if (nextClosestVoid || allowZeroWidth) {
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
     * @param {Point} point
     * @return {Point|Null}
     */

    getNextCharacterPoint: (fn, editor) => point => {
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
     * @param {Point} point
     * @return {Point|Null}
     */

    getNextNonVoidPoint: (fn, editor) => point => {
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
     * @param {Point} point
     * @return {Point|Null}
     */

    getNextWordPoint: (fn, editor) => point => {
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
     * @param {Range} range
     * @return {Range}
     */

    getNonHangingRange: (fn, editor) => range => {
      const { value: { document } } = editor
      const { end } = range

      if (editor.isHanging(range)) {
        const [prevText, prevPath] = document.previousText(end.path)
        const newEnd = end.moveTo(prevPath, prevText.text.length)
        const nonHanging = range.setEnd(newEnd).normalize(document)
        return nonHanging
      } else {
        return range
      }
    },

    /**
     * Calculate the previous point backward from a `point`.
     *
     * @param {Point} point
     * @return {Point|Null}
     */

    getPreviousPoint: (fn, editor) => (point, options = {}) => {
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

        // If the point is now inside a new void node, no matter if the void
        // node is zero-width, we still count it as a new point.
        const prevClosestVoid = document.closest(prevPath, editor.isVoid)

        // If the text node and we're still in the same block, continue onwards
        // because we need to have moved one point backwards, and an empty text
        // will be perceived as not moving.
        if (prevNode.text.length === 0) {
          if (prevClosestVoid || allowZeroWidth) {
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
     * @param {Point} point
     * @return {Point|Null}
     */

    getPreviousCharacterPoint: (fn, editor) => point => {
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
     * @param {Point} point
     * @return {Point|Null}
     */

    getPreviousNonVoidPoint: (fn, editor) => point => {
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
     * @param {Point} point
     * @return {Point|Null}
     */

    getPreviousWordPoint: (fn, editor) => point => {
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
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

export default CoreQueriesPlugin
