/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.unwrapInline('hashtag')
}

export const input = (
  <value>
    
      <block>
        <inline>
          wo<anchor />
        </inline>
        <hashtag>
          <inline>rd</inline>
        </hashtag>
        <hashtag>
          <inline>an</inline>
        </hashtag>
        <inline>
          ot<focus />her
        </inline>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <inline>
          wo<anchor />
        </inline>
        <inline>rd</inline>
        <inline>an</inline>
        <inline>
          ot<focus />her
        </inline>
      </block>
    
  </value>
)
