/** @jsx h */

import h from '../../helpers/h'

export default function (editor) {
  editor.delete()
  editor.flush()
  editor.undo()
}

export const input = (
  <value>
    <document>
      <block>
        wo<cursor />rd
      </block>
    </document>
  </value>
)

export const output = input
