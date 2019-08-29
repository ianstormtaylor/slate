import { Range } from '..'

/**
 * Get the start point at a `path`.
 *
 * @param {Path} path
 * @return {Point}
 */

export const getStartOfPath = (fn, editor) => path => {
  const { value: { document } } = editor
  const [, firstPath] = document.firstText({ path })
  const point = document.createPoint({ path: firstPath, offset: 0 })
  return point
}

/**
 * Get the end point at a `path`.
 *
 * @param {Path} path
 * @return {Point}
 */

export const getEndOfPath = (fn, editor) => path => {
  const { value: { document } } = editor
  const [lastNode, lastPath] = document.lastText({ path })
  const point = document.createPoint({
    path: lastPath,
    offset: lastNode.text.length,
  })

  return point
}

/**
 * Get the range of a node at `path`.
 *
 * @param {Path} path
 * @return {Range}
 */

export const getRangeOfPath = (fn, editor) => path => {
  const anchor = editor.getStartOfPath(path)
  const focus = editor.getEndOfPath(path)
  const range = Range.create({ anchor, focus })
  return range
}
