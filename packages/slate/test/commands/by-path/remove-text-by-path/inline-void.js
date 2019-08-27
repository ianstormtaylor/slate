/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.removeTextByPath([0, 1, 0], 0, 1)
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text />
        <emoji>
          <text key="a">
            <cursor />a
          </text>
        </emoji>
        <text />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <text />
        <emoji>
          <cursor />
        </emoji>
        <text />
      </paragraph>
    </document>
  </value>
)
