/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.addMark('bold')
  editor.flush().undo()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <b>
          w<anchor />o
        </b>r<focus />d
      </paragraph>
    </document>
  </value>
)

export const output = input
