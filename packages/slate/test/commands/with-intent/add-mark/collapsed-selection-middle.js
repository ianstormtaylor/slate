/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.addMark('bold')
  editor.insertText('a')
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
        wo<b>a</b>
        <cursor />rd
      </paragraph>
    </document>
  </value>
)
