/**
 * Commands.
 *
 * @type {Object}
 */

const Commands = {}

/**
 * Split all of the text and inline nodes at a `point`.
 *
 * @param {Point} point
 * @return {Point}
 */

Commands.splitInlineAtPoint = (fn, editor) => point => {
  let { value: { document } } = editor
  const furthestInline = document.furthestInline(point.path)
  let targetPath = point.path

  if (furthestInline) {
    ;[, targetPath] = furthestInline
  }

  editor.splitDescendantsByPath(targetPath, point.path, point.offset)

  document = editor.value.document
  const [, nextPath] = document.nextText(point.path)
  const newPoint = point
    .moveTo(nextPath, 0)
    .setKey(null)
    .normalize(document)

  return newPoint
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Commands
