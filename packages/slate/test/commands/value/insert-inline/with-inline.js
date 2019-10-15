/** @jsx h */

import { h } from '../../../helpers'
import { Inline } from 'slate'

export const run = editor => {
  editor.insertInline(Inline.create('emoji'))
}

export const input = (
  <value>
    <block>
      wo<cursor />rd
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      wo<inline void>
        <cursor />
      </inline>rd
    </block>
  </value>
)
