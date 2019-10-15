/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.replaceMark('italic', 'bold')
}

export const input = (
  <value>
    
      <block>
        wor
        <i>
          <anchor />d<focus />
        </i>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        wor
        <b>
          <anchor />d<focus />
        </b>
      </block>
    
  </value>
)
