/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteBackward()
}

export const input = (
  <value>
    
      <block>Hello</block>
      <list>
        <item>
          <cursor />world!
        </item>
      </list>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        Hello<cursor />world!
      </block>
    
  </value>
)
