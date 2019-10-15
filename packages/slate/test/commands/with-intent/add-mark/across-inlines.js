/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.addMark('bold')
}

export const input = (
  <value>
    
      <block>
        <text />
        <inline>
          wo<anchor />rd
        </inline>
        <text />
      </block>
      <block>
        <text />
        <inline>
          an<focus />other
        </inline>
        <text />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <text />
        <inline>
          wo
          <b>
            <anchor />rd
          </b>
        </inline>
        <b />
      </block>
      <block>
        <b />
        <inline>
          <b>an</b>
          <focus />other
        </inline>
        <text />
      </block>
    
  </value>
)
