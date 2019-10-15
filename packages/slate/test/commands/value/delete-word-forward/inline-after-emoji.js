/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteWordForward()
}

export const input = (
  <value>
    
      <block>
        <cursor />
        <inline>word</inline>📛
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <cursor />
      </block>
    
  </value>
)
