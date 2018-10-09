/**
 * Slate-specific object types.
 *
 * @type {Object}
 */

export const TYPES = {
  block: '@@__SLATE_BLOCK__@@',
  change: '@@__SLATE_CHANGE__@@',
  decoration: '@@__SLATE_DECORATION__@@',
  document: '@@__SLATE_DOCUMENT__@@',
  editor: '@@__SLATE_EDITOR__@@',
  inline: '@@__SLATE_INLINE__@@',
  leaf: '@@__SLATE_LEAF__@@',
  mark: '@@__SLATE_MARK__@@',
  operation: '@@__SLATE_OPERATION__@@',
  point: '@@__SLATE_POINT__@@',
  range: '@@__SLATE_RANGE__@@',
  selection: '@@__SLATE_SELECTION__@@',
  text: '@@__SLATE_TEXT__@@',
  value: '@@__SLATE_VALUE__@@',
}

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
