import Path from '../utils/path-utils'

/**
 * Commands.
 *
 * @type {Object}
 */

const Commands = {}

/**
 * Split at a `point` and up to a `parentPath`.
 *
 * @param {Point} point
 * @param {Path} path
 */

Commands.splitNodeAtPoint = (fn, editor) => (point, parentPath) => {
  parentPath = Path.create(parentPath)

  editor.withoutNormalizing(() => {
    const { value: { document } } = editor
    const { path, offset } = point
    editor.splitNodeByPath(path, offset)

    // If the parent path is the same as the text node, we're done.
    if (parentPath.equals(path)) {
      return
    }

    let position = offset
    let prevPath = path

    // Iterate up the ancestors, splitting each node until `parentPath` is met.
    for (const [, ancestorPath] of document.ancestors(path)) {
      const target = position
      position = prevPath.last() + 1
      prevPath = ancestorPath
      editor.splitNodeByPath(ancestorPath, position, { target })

      if (ancestorPath.equals(parentPath)) {
        break
      }
    }
  })
}

/**
 * Split at a `point` and up to blocks of `height`.
 *
 * @param {Point} point
 * @param {number} height
 */

Commands.splitBlockAtPoint = (fn, editor) => (point, height = 1) => {
  editor.withoutNormalizing(() => {
    const { value: { document } } = editor
    let h = 0
    let blockPath

    for (const [node, path] of document.ancestors(point.path)) {
      if (h >= height) {
        break
      } else if (node.object === 'block') {
        blockPath = path
        h++
      }
    }

    if (blockPath) {
      editor.splitNodeAtPoint(point, blockPath)
    }
  })
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Commands
