/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.wrapText('[[', ']]')
}

export const input = (
  <value>
    
      <block>
        <inline>
          wo<anchor />rd
        </inline>
        <inline>
          an<focus />other
        </inline>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <inline>
          wo[[<anchor />rd
        </inline>
        <inline>
          an<focus />]]other
        </inline>
      </block>
    
  </value>
)
