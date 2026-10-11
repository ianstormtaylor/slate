import assert from 'assert'
import { Editor, Transforms } from 'slate'
import { jsx } from '../../..'

export const input = jsx(
  'editor',
  {},
  jsx(
    'block',
    {},
    'one',
    jsx('anchor', {}),
    'two',
    jsx('inline', { readOnly: true }, jsx('focus', {})),
    'three'
  )
)

export const run = (editor, options = {}) => {
  const refs = Editor.pointRefs(editor).size
  Transforms.insertFragment(editor, [jsx('block', {}, 'inserted')], options)
  assert.equal(Editor.pointRefs(editor).size, refs)
}

export const output = jsx(
  'editor',
  {},
  jsx('block', {}, 'oneinserted', jsx('cursor', {}), 'three')
)
