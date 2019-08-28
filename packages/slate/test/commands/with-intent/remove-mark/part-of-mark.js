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
          wor<anchor />d<focus />
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
        <anchor />d<focus />
      </paragraph>
    </document>
  </value>
)
