/** @jsx h */

import h from '../../helpers/h'
import { PathUtils } from 'slate'

export default function (editor) {
  editor.unwrapNodeByPath(PathUtils.create([0, 0]))
  editor.flush()
  editor.undo()
}

export const input = (
  <value>
    <document>
      <quote>
        <block>
          <cursor />one
        </block>
        <block>two</block>
        <block>three</block>
      </quote>
    </document>
  </value>
)

export const output = input
