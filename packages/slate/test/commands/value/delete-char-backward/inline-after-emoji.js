/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteCharBackward()
}

export const input = (
  <value>

      <block>
        <inline>word</inline>📛<cursor />
      </block>

  </value>
)

export const output = (
  <value>

      <block>
        <inline>
          word<cursor />
        </inline>
      </block>

  </value>
)
