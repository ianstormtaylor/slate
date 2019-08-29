/** @jsx h */

import h from '../../../helpers/h'
import { Set } from 'immutable'
import { Mark } from 'slate'
import { Editor } from 'slate'

export const input = (
  <value>
    <document>
      <paragraph>
        <text>Cat is Cute</text>
      </paragraph>
      <paragraph>
        <b>
          <cursor />
          Dog is Delightful
        </b>
      </paragraph>
    </document>
  </value>
)

export default function(value) {
  const editor = new Editor({ value })
  const { document, selection } = value
  return editor.getInsertMarksAtPoint(selection.start, document)
}

export const output = Set.of(Mark.create('bold'))
