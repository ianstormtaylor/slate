/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitInline()
}

export const input = (
  <value>
    <block>
      <inline>
        <b>
          wo<cursor />rd
        </b>
      </inline>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <inline>
        <b>wo</b>
      </inline>
      <inline>
        <b>
          <cursor />rd
        </b>
      </inline>
    </block>
  </value>
)
