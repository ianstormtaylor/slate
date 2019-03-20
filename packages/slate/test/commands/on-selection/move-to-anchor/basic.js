/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.moveToAnchor()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <anchor />one<focus />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <cursor />one
      </paragraph>
    </document>
  </value>
)
