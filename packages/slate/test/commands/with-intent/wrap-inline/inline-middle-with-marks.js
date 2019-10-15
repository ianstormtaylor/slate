/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.wrapInline('hashtag')
}

export const input = (
  <value>
    
      <block>
        <text />
        <inline>
          <b>
            he<anchor />ll<focus />o
          </b>
        </inline>
        <text />
      </block>
    
  </value>
)

// TODO: this selection logic isn't right
export const output = (
  <value>
    
      <block>
        <text />
        <inline>
          <b>he</b>
        </inline>
        <text />
        <inline>
          <inline>
            <b>
              <anchor />ll
            </b>
          </inline>
        </inline>
        <text />
        <inline>
          <b>
            <focus />o
          </b>
        </inline>
        <text />
      </block>
    
  </value>
)
