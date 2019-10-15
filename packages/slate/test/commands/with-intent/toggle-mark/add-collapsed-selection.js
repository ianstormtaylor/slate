/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.toggleMark('bold')
  editor.insertText('s')
}

export const input = (
  <value>
    
      <block>
        word<cursor />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        word<b>
          s<cursor />
        </b>
      </block>
    
  </value>
)
