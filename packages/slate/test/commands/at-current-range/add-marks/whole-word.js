/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.addMarks(['bold', 'italic'])
}

export const input = (
  <value>
    <document>
      <paragraph>
        <anchor />word<focus />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <anchor />
        <i>
          <b>word</b>
        </i>
        <focus />
      </paragraph>
    </document>
  </value>
)
