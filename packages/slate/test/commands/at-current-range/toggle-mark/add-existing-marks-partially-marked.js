/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.toggleMark('bold')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <b>
          <anchor />a
        </b>
        <i>
          wo<focus />rd
        </i>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <b>
          <anchor />a
        </b>
        <b>
          <i>wo</i>
        </b>
        <i>
          <focus />rd
        </i>
      </paragraph>
    </document>
  </value>
)
