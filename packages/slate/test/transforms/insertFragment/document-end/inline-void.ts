import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = (editor, options = {}) => {
  Transforms.insertFragment(editor, [jsx('block', {}, 'pasted')], options)
}

export const input = jsx(
  'editor',
  {},
  jsx(
    'block',
    {},
    jsx('anchor', {}),
    'before',
    jsx('inline', { void: true }, jsx('text', {})),
    jsx('text', {})
  ),
  jsx('block', {}, jsx('focus', {}))
)

export const output = jsx(
  'editor',
  {},
  jsx('block', {}, 'pasted', jsx('cursor', {}))
)
