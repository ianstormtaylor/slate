/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertText('a')
}

export const input = (
  <value>
    
      <block>
        w<b>
          o<cursor />r
        </b>d
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        w<b>
          oa<cursor />r
        </b>d
      </block>
    
  </value>
)
