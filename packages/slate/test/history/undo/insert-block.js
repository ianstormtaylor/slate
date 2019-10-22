/** @jsx h */

import h from '../../helpers/h'

export default function (editor) {
  editor.insertBlock('quote')
  editor.flush()
  editor.undo()
}

export const input = (
  <value>
    <document>
      <block>
        <cursor />one
      </block>
    </document>
  </value>
)

export const output = input
