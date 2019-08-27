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
        <b>Dog is</b>
        <link>
          <text>
            <cursor />
            Delightful
          </text>
        </link>
        <text />
      </paragraph>
    </document>
  </value>
)

export default function(value) {
  const editor = new Editor({ value })
  const { document, selection } = value
  return document.getInsertMarksAtPoint(selection.start, editor)
}

export const output = Set.of(Mark.create('bold'))
