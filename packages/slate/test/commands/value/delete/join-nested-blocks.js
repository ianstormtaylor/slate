/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    
      <block>
        <block>
          word<anchor />
        </block>
        <block>
          <focus />another
        </block>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <block>
          word<cursor />another
        </block>
      </block>
    
  </value>
)
