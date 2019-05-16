/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.toggleMark('bold')
}

export const input = (
  <value>
    <document>
      <paragraph>
        w<anchor />o<focus />rd
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
