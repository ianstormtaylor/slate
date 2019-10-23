/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.wrapBlock('quote')
}

export const input = (
  <value>
    <block>
      <inline>
        wo<anchor />rd
      </inline>
    </block>
    <block>
      <inline>
        an<focus />other
      </inline>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block>
        <inline>
          wo<anchor />rd
        </inline>
      </block>
      <block>
        <inline>
          an<focus />other
        </inline>
      </block>
    </block>
  </value>
)
