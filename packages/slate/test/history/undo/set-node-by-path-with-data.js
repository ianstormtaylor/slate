/** @jsx h */

import h from '../../helpers/h'
import { PathUtils } from 'slate'

export default function (editor) {
  editor.setNodeByPath(PathUtils.create([0]), {
    data: { thing: 'value' },
  })

  editor.flush()
  editor.undo()
}

export const input = (
  <value>
    <document>
      <paragraph key="a">one</block>
    </document>
  </value>
)

export const output = input
