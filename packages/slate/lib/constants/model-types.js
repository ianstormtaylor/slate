'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Slate-specific model types.
 *
 * @type {Object}
 */

var MODEL_TYPES = {
  BLOCK: '@@__SLATE_BLOCK__@@',
  CHANGE: '@@__SLATE_CHANGE__@@',
  CHARACTER: '@@__SLATE_CHARACTER__@@',
  DOCUMENT: '@@__SLATE_DOCUMENT__@@',
  HISTORY: '@@__SLATE_HISTORY__@@',
  INLINE: '@@__SLATE_INLINE__@@',
  MARK: '@@__SLATE_MARK__@@',
  RANGE: '@@__SLATE_RANGE__@@',
  SCHEMA: '@@__SLATE_SCHEMA__@@',
  SELECTION: '@@__SLATE_SELECTION__@@',
  STACK: '@@__SLATE_STACK__@@',
  STATE: '@@__SLATE_STATE__@@',
  TEXT: '@@__SLATE_TEXT__@@'
};

/**
 * Export.
 *
 * @type {Object}
 */

exports.default = MODEL_TYPES;