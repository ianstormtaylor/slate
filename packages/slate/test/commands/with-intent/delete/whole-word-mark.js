/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    
      <block>
        <b>
          <anchor />word<focus />
        </b>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <b>
          <cursor />
        </b>
      </block>
    
  </value>
)
