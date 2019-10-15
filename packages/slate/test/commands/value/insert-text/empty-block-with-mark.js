/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertText('Cat')
}

export const input = (
  <value>
    
      <block>
        <b>
          <cursor />
        </b>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <b>
          Cat<cursor />
        </b>
      </block>
    
  </value>
)
