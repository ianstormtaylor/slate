/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertTextAtPath([0, 0], 4, 'x')
}

export const input = (
  <value>
    
      <block>
        <b>
          w<cursor />ord
        </b>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <b>
          w<cursor />ord
        </b>x
      </block>
    
  </value>
)
