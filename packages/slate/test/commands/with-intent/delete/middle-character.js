/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    
      <block>
        w<anchor />o<focus />rd
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        w<cursor />rd
      </block>
    
  </value>
)
