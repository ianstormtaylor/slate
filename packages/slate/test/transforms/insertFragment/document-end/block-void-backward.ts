import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = (editor, options = {}) => {
  Transforms.insertFragment(editor, [jsx('block', {}, 'pasted')], options)
}

export const input = jsx(
  'editor',
  {},
  jsx('block', {}, jsx('focus', {}), 'before'),
  jsx('block', { void: true }, jsx('text', {})),
  jsx('block', {}, jsx('anchor', {}))
)

export const output = jsx(
  'editor',
  {},
  jsx('block', {}, 'pasted', jsx('cursor', {}))
)
