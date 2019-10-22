/** @jsx h */

import h from '../../helpers/h'

export default function (editor) {
  editor.insertText('text')
  editor.flush()
  editor.undo()
}

export const input = (
  <value>
    <document>
      <block>
        one<cursor />
      </block>
    </document>
  </value>
)

export const output = input
