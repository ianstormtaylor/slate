/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.splitDescendantsByPath([0], [0, 0], 2)
}

export const input = (
  <value>
    <document>
      <paragraph key="a">
        <text key="b">
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
        w<anchor />o
      </paragraph>
      <paragraph>
        r<focus />d
      </paragraph>
    </document>
  </value>
)
