/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertTextAtPath([0, 0], 0, 'a')
}

export const input = (
  <value>
    
      <block>
        <b>
          wo<cursor />rd
        </b>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        a<b>
          wo<cursor />rd
        </b>
      </block>
    
  </value>
)
