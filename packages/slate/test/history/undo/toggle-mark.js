/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.addMark('bold')
  editor.flush().removeMark('bold')
  editor.flush().undo()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one <anchor />two<focus /> three
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one{' '}
        <b>
          <anchor />two
        </b>
        <focus /> three
      </paragraph>
    </document>
  </value>
)
