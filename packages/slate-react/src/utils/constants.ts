/**
 * DOM data attribute strings that refer to Slate concepts.
 */

export const DATA = {
  EDITOR: 'data-slate-editor',
  FRAGMENT: 'data-slate-fragment',
  KEY: 'data-key',
  LEAF: 'data-slate-leaf',
  LENGTH: 'data-slate-length',
  OBJECT: 'data-slate-object',
  OFFSET_KEY: 'data-offset-key',
  SPACER: 'data-slate-spacer',
  STRING: 'data-slate-string',
  TEXT: 'data-slate-object',
  VOID: 'data-slate-void',
  ZERO_WIDTH: 'data-slate-zero-width',
}

/**
 * DOM selector strings that refer to Slate concepts.
 */

export const SELECTORS = {
  BLOCK: `[${DATA.OBJECT}="block"]`,
  EDITOR: `[${DATA.EDITOR}]`,
  INLINE: `[${DATA.OBJECT}="inline"]`,
  KEY: `[${DATA.KEY}]`,
  LEAF: `[${DATA.LEAF}]`,
  OBJECT: `[${DATA.OBJECT}]`,
  STRING: `[${DATA.STRING}]`,
  TEXT: `[${DATA.OBJECT}="text"]`,
  VOID: `[${DATA.VOID}]`,
  ZERO_WIDTH: `[${DATA.ZERO_WIDTH}]`,
}

/**
 * The transfer types that Slate recognizes.
 */

export const TYPES = {
  FRAGMENT: 'application/x-slate-fragment',
  HTML: 'text/html',
  NODE: 'application/x-slate-node',
  RICH: 'text/rtf',
  TEXT: 'text/plain',
}
