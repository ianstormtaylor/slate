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
        <i>
          w<anchor />o
        </i>r<focus />d
      </paragraph>
    </document>
  </value>
)

export const output = input
