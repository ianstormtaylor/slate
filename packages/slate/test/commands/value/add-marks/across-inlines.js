/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.addMarks(['bold', 'italic'])
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
        <i>
          <b>
            <anchor />rd
          </b>
        </i>
      </inline>
      <i>
        <b />
      </i>
    </block>
    <block>
      <i>
        <b />
      </i>
      <inline>
        <i>
          <b>an</b>
        </i>
        <focus />other
      </inline>
      <text />
    </block>
  </value>
)
