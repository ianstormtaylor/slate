/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.replaceMark('italic', 'bold')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <anchor />
        <i>word</i>
        <focus />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <anchor />
        <b>word</b>
        <focus />
      </paragraph>
    </document>
  </value>
)
