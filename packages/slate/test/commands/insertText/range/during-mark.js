/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertText('a')
}

export const input = (
  <value>
    
      <block>
        w<mark key="a">
          o<cursor />r
        </mark>d
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        w<mark key="a">
          oa<cursor />r
        </mark>d
      </block>
    
  </value>
)
