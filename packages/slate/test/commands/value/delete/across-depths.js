/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    
      <block>
        <block>
          one<anchor />
        </block>
      </block>
      <block>
        <focus />two
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <block>
          one<cursor />two
        </block>
      </block>
    
  </value>
)
