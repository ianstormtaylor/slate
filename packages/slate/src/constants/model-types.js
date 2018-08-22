/**
 * Slate-specific model types.
 *
 * @type {Object}
 */

const MODEL_TYPES = {
  BLOCK: '@@__SLATE_BLOCK__@@',
  CHANGE: '@@__SLATE_CHANGE__@@',
  DECORATION: '@@__SLATE_DECORATION__@@',
  DOCUMENT: '@@__SLATE_DOCUMENT__@@',
  HISTORY: '@@__SLATE_HISTORY__@@',
  INLINE: '@@__SLATE_INLINE__@@',
  LEAF: '@@__SLATE_LEAF__@@',
  MARK: '@@__SLATE_MARK__@@',
  OPERATION: '@@__SLATE_OPERATION__@@',
  POINT: '@@__SLATE_POINT__@@',
  RANGE: '@@__SLATE_RANGE__@@',
  SCHEMA: '@@__SLATE_SCHEMA__@@',
  SELECTION: '@@__SLATE_SELECTION__@@',
  STACK: '@@__SLATE_STACK__@@',
  TEXT: '@@__SLATE_TEXT__@@',
  VALUE: '@@__SLATE_VALUE__@@',
}

/**
 * Export type identification function
 *
 * @param {string} type
 * @param {any} any
 * @return {boolean}
 */

export function isType(type, any) {
  return !!(any && any[MODEL_TYPES[type]])
}

/**
 * Export.
 *
 * @type {Object}
 */

export default MODEL_TYPES
