/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.insertText(' a few words')
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
        word a few words<cursor />
      </block>
    
  </value>
)
