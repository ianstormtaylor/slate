/** @jsx h */

import h from '../../../helpers/h'
import { Set } from 'immutable'

export const input = (
  <value>
    <document>
      <paragraph>
        <text>
          C<cursor />at is Cute
        </text>
      </paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getInsertMarksAtPoint(selection.start)
}

export const output = Set.of()
