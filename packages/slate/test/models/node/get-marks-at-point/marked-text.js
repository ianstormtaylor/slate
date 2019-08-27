/** @jsx h */

import h from '../../../helpers/h'
import { Set } from 'immutable'
import { Mark } from 'slate'
import { Editor } from 'slate'

export const input = (
  <value>
    <document>
      <paragraph>
        <i>
          C<cursor />
          at{' '}
        </i>
        is
        <b> Cute</b>
      </paragraph>
    </document>
  </value>
)

export default function(value) {
  const editor = new Editor({ value })
  const { document, selection } = value
  return document.getInsertMarksAtPoint(selection.start, editor)
}

export const output = Set.of(Mark.create('italic'))
