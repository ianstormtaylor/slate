/** @jsx jsx */

import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.move(editor, { edge: 'focus', reverse: true })
}

export const input = (
  <editor>
    <block>
      one <anchor />
      tw
      <focus />o three
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      one <anchor />t<focus />
      wo three
    </block>
  </editor>
)
