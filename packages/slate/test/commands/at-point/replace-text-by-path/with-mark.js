/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.replaceTextAtPath([0, 1], 0, 1, 'three', ['italic'])
}

export const input = (
  <value>
    
      <block>
        one
        <b>
          <cursor />two
        </b>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        one
        <i>three</i>
        <b>
          <cursor />wo
        </b>
      </block>
    
  </value>
)
