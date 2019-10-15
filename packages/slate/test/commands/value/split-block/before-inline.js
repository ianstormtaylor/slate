/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitBlock()
}

export const input = (
  <value>
    
      <block>
        word<link href="website.com">
          <cursor />hyperlink
        </inline>word
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        word<link href="website.com" />
      </block>
      <block>
        <link href="website.com">
          <cursor />hyperlink
        </inline>word
      </block>
    
  </value>
)
