/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.replaceMark('italic', 'bold')
}

export const input = (
  <value>
    <document>
      <paragraph>
        wo
        <i>
          <anchor />rd
        </i>
      </paragraph>
      <paragraph>
        <i>an</i>
        <focus />other
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        wo
        <b>
          <anchor />rd
        </b>
      </paragraph>
      <paragraph>
        <b>an</b>
        <focus />other
      </paragraph>
    </document>
  </value>
)
