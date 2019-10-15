/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertFragment(
    
      <block>
        <hashtag>fragment</hashtag>
      </block>
    
  )
}

export const input = (
  <value>
    
      <block>
        <inline>
          wo<cursor />rd
        </inline>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <inline>wo</inline>
        <hashtag>
          fragment<cursor />
        </hashtag>
        <inline>rd</inline>
      </block>
    
  </value>
)
