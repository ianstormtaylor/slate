/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeMark('bold')
}

export const input = (
  <value>
    
      <block>
        <b>
          wor<focus />d<anchor />
        </b>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <b>wor</b>
        <focus />d<anchor />
      </block>
    
  </value>
)
