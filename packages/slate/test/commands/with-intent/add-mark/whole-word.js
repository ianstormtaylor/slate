/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.addMark('bold')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <anchor />word<focus />
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
