/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.replaceMark('italic', 'bold')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <i>
          <anchor />word<focus />
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
          <anchor />word<focus />
        </b>
      </paragraph>
    </document>
  </value>
)
