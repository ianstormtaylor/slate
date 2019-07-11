/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.removeMark('bold')
  editor.flush().undo()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <b>
          <anchor />one<focus />
        </b>
      </paragraph>
    </document>
  </value>
)

export const output = input
