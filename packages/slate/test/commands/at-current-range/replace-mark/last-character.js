/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.replaceMark('italic', 'bold')
}

export const input = (
  <value>
    <document>
      <paragraph>
        wor
        <i>
          <anchor />d<focus />
        </i>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        wor
        <b>
          <anchor />d<focus />
        </b>
      </paragraph>
    </document>
  </value>
)
