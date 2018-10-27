/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.removeMark('bold')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <anchor />
        <b>w</b>
        <focus />ord
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <anchor />w<focus />ord
      </paragraph>
    </document>
  </value>
)
