/** @jsx h */

import h from '../../../helpers/h'
import { Mark } from 'slate'

export default function(editor) {
  const marks = Mark.createSet([{ type: 'bold' }])
  editor.insertText('a', marks)
}

export const input = (
  <value>
    <document>
      <paragraph>
        word<cursor />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        word<b>a</b>
        <cursor />
      </paragraph>
    </document>
  </value>
)
