import DATA_ATTRS from './data-attributes'

/**
 * DOM selector strings that refer to Slate concepts.
 *
 * @type {String}
 */

export default {
  BLOCK: `[${DATA_ATTRS.OBJECT}="block"]`,
  EDITOR: `[${DATA_ATTRS.EDITOR}]`,
  INLINE: `[${DATA_ATTRS.OBJECT}="inline"]`,
  KEY: `[${DATA_ATTRS.KEY}]`,
  LEAF: `[${DATA_ATTRS.LEAF}]`,
  OBJECT: `[${DATA_ATTRS.OBJECT}]`,
  STRING: `[${DATA_ATTRS.STRING}]`,
  TEXT: `[${DATA_ATTRS.OBJECT}="text"]`,
  VOID: `[${DATA_ATTRS.VOID}]`,
  ZERO_WIDTH: `[${DATA_ATTRS.ZERO_WIDTH}]`,
}
