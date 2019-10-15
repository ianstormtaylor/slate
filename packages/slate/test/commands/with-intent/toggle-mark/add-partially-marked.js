/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.toggleMark('bold')
}

export const input = (
  <value>
    
      <block>
        <anchor />a<b>
          word<focus />
        </b>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <b>
          <anchor />aword<focus />
        </b>
      </block>
    
  </value>
)
