/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertText('is ')
}

export const input = (
  <value>
    
      <block>
        <b>
          <i>Cat</i>
        </b>
      </block>
      <block>
        <b>
          <cursor />Cute
        </b>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <b>
          <i>Cat</i>
        </b>
      </block>
      <block>
        <b>
          is <cursor />Cute
        </b>
      </block>
    
  </value>
)
