import { Range } from '..'

/**
 * Get the start point at a `path`.
 *
 * @param {Path} path
 * @return {Point}
 */

export const getPointAtStartOfPath = (fn, editor) => path => {
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

export const getPointAtEndOfPath = (fn, editor) => path => {
  const { value: { document } } = editor
  const [lastNode, lastPath] = document.lastText({ path })
  const point = document.createPoint({
    path: lastPath,
    offset: lastNode.text.length,
  })

  return point
}

/**
 * Get a range at the end of a `path`.
 *
 * @param {Path} path
 * @return {Point}
 */

export const getRangeAtEndOfPath = (fn, editor) => path => {
  const { value: { document } } = editor
  const point = editor.getPointAtEndOfPath(path)
  const range = document.createRange({ anchor: point, focus: point })
  return range
}

export const getFirstPoint = (fn, editor) => path => {
  const { value: { document } } = editor
  const [firstText, firstPath] = document.firstText({ path })
  const firstPoint = document.createPoint({
    key: firstText.key,
    path: firstPath,
    offset: 0,
  })

  return firstPoint
}

export const getLastPoint = (fn, editor) => path => {
  const { value: { document } } = editor
  const [lastText, lastPath] = document.lastText({ path })
  const lastPoint = document.createPoint({
    key: lastText.key,
    path: lastPath,
    offset: lastText.text.length,
  })

  return lastPoint
}

export const getRange = (fn, editor) => path => {
  const anchor = editor.getFirstPoint(path)
  const focus = editor.getLastPoint(path)
  const range = Range.create({ anchor, focus })
  return range
}
