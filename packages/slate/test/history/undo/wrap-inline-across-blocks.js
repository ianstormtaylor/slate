/** @jsx h */

import h from '../../helpers/h'

export default function (editor) {
  editor.wrapInline('hashtag')
  editor.flush()
  editor.undo()
}

export const input = (
  <value>
    <document>
      <block>
        wo<anchor />rd
      </block>
      <block>
        an<focus />other
      </block>
    </document>
  </value>
)

export const output = input
