/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteCharForward()
}

export const input = (
  <value>
    
      <block>
        <inline>
          <cursor />📛word
        </inline>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <cursor />
        <inline>word</inline>
      </block>
    
  </value>
)
