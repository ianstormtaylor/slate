/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertText('a')
}

export const input = (
  <value>
    
      <block>
        w<b>
          or<cursor />
        </b>d
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        w<b>
          ora<cursor />
        </b>d
      </block>
    
  </value>
)
