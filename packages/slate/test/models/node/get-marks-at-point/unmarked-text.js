/** @jsx h */

import h from '../../../helpers/h'
import { Set } from 'immutable'
import { Editor } from 'slate'

export const input = (
  <value>
    <document>
      <paragraph>
        <text>
          C<cursor />
          at is Cute
        </text>
      </paragraph>
    </document>
  </value>
)

export default function(value) {
  const editor = new Editor({ value })
  const { document, selection } = value
  return editor.getInsertMarksAtPoint(selection.start, document)
}

export const output = Set.of()
