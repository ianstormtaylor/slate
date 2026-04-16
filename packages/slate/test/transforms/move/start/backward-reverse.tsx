/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.move(editor, { edge: 'start', reverse: true })
}
export const input = (
  <editor>
    <block>
      one <focus />
      two t<anchor />
      hree
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      one
      <focus /> two t<anchor />
      hree
    </block>
  </editor>
)
