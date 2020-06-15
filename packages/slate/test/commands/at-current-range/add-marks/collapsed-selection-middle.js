/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.addMarks(['bold', 'italic']).insertText('a')
}

export const input = (
  <value>
    <document>
      <paragraph>
        wo<cursor />rd
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        wo<i>
          <b>a</b>
        </i>
        <cursor />rd
      </paragraph>
    </document>
  </value>
)
