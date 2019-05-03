/** @jsx h */

import h from '../../../helpers/h'
import { Set } from 'immutable'
import { Mark } from 'slate'

export const input = (
  <value>
    <document>
      <paragraph>
        <text>Cat is Cute</text>
      </paragraph>
      <paragraph>
        <b>
          <cursor />Dog is Delightful
        </b>
      </paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getInsertMarksAtPoint(selection.start)
}

export const output = Set.of(Mark.create('bold'))
