/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.unwrapInline('hashtag')
}

export const input = (
  <value>
    <block>
      he<inline>ll</inline>o <anchor />w<inline>
        or<focus />
      </inline>d
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      he<inline>ll</inline>o <anchor />wor<focus />d
    </block>
  </value>
)
