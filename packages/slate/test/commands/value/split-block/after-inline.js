/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitBlock()
}

export const input = (
  <value>
    
      <block>
        word<link href="website.com">hyperlink</inline>
        <cursor />word
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        word<link href="website.com">hyperlink</inline>
      </block>
      <block>
        <cursor />word
      </block>
    
  </value>
)
