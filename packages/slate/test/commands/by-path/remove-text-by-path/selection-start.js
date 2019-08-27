/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.removeTextByPath([0, 0], 2, 1)
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text key="a">
          w<anchor />or<focus />d
        </text>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        w<anchor />o<focus />d
      </paragraph>
    </document>
  </value>
)
