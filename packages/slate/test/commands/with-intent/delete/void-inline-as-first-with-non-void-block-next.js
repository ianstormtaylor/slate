/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    
      <block>
        one<emoji>
          <anchor />
        </emoji>two
      </block>
      <block>
        <focus />three
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        one<cursor />three
      </block>
    
  </value>
)
