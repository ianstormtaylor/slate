/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeMark('bold')
}

export const input = (
  <value>
    
      <block>
        wor
        <b>
          <anchor />d<focus />
        </b>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        wor<anchor />d<focus />
      </block>
    
  </value>
)
