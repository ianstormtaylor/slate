/**
 * Slate-specific object types.
 *
 * @type {Object}
 */

export const TYPES = [
  'block',
  'change',
  'decoration',
  'document',
  'editor',
  'inline',
  'leaf',
  'mark',
  'operation',
  'point',
  'range',
  'selection',
  'text',
  'value',
].reduce((memo, type) => {
  memo[type] = Symbol(`SLATE_${type.toUpperCase()}`)
  return memo
}, {})

/**
 * Determine whether a `value` is of `type`.
 *
 * @param {string} type
 * @param {any} value
 * @return {boolean}
 */

export default function isObject(type, value) {
  return !!(value && value[TYPES[type]])
}
