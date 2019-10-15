/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.unwrapInline('hashtag')
}

export const input = (
  <value>
    
      <block>
        he<hashtag>ll</hashtag>o <anchor />w<hashtag>
          or<focus />
        </hashtag>d
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        he<hashtag>ll</hashtag>o <anchor />wor<focus />d
      </block>
    
  </value>
)
