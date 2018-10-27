/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.delete()
  editor.flush().undo()
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

export const output = input
