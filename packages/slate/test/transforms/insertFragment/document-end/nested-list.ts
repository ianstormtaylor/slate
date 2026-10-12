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
    { type: 'list' },
    jsx(
      'block',
      { type: 'item' },
      jsx('block', {}, jsx('anchor', {}), 'before'),
      jsx('block', { void: true }, jsx('text', {})),
      jsx('block', {}, jsx('focus', {}))
    )
  )
)

export const output = jsx(
  'editor',
  {},
  jsx(
    'block',
    { type: 'list' },
    jsx(
      'block',
      { type: 'item' },
      jsx('block', {}, 'pasted', jsx('cursor', {}))
    )
  )
)
