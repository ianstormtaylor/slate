/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.unwrapBlock('quote')
}

export const input = (
  <value>
    
      <block>
        <block>
          <inline>
            wo<anchor />rd
          </inline>
        </block>
        <block>
          <inline>
            an<focus />other
          </inline>
        </block>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <inline>
          wo<anchor />rd
        </inline>
      </block>
      <block>
        <inline>
          an<focus />other
        </inline>
      </block>
    
  </value>
)
