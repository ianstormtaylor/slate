/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      one<inline>
        two<inline>three</inline>four
      </inline>five
    </block>
  </value>
)

export const run = editor => {
  return Array.from(editor.leafInlines())
}

export const output = [[<inline>three</inline>, [0, 1, 1]]]
