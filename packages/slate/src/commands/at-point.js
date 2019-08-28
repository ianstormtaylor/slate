/**
 * Commands.
 *
 * @type {Object}
 */

const Commands = {}

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
      editor.splitDescendantsByPath(blockPath, point.path, point.offset)
    }
  })
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Commands
