/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.setInlines({ type: 'comment' })
}

export const input = (
  <value>

    <block>
      <inline>
        <inline>
          <cursor />word
          </inline>
      </inline>
    </block>

  </value>
)

export const output = (
  <value>

    <block>
      <inline>
        <inline>
          <cursor />word
          </inline>
      </inline>
    </block>

  </value>
)
