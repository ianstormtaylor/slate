/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.replaceMark('italic', 'bold')
}

export const input = (
  <value>
    <document>
      <paragraph>
        w
        <i>
          <anchor />o
        </i>
        <focus />rd
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        w
        <b>
          <anchor />o
        </b>
        <focus />rd
      </paragraph>
    </document>
  </value>
)
