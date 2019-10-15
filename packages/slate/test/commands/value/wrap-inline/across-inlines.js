/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.wrapInline('hashtag')
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
        <inline>wo</inline>
        <inline>
          <inline>
            <anchor />rd
          </inline>
          <inline>an</inline>
        </inline>
        <inline>
          <focus />other
        </inline>
      </block>
    
  </value>
)
