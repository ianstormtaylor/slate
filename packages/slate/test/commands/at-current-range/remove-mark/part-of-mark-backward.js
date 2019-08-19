/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.removeMark('bold')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <b>
          wor<focus />d<anchor />
        </b>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <b>wor</b>
        <focus />d<anchor />
      </paragraph>
    </document>
  </value>
)
