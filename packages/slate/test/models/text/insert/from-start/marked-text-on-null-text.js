/** @jsx h */

import { List } from 'immutable'
import { Mark } from 'slate'
import h from '../../../../helpers/h'

export const input = (
  <text>
    <i />
  </text>
)

export default function(t) {
  return t.insertText(0, 'Cat is Cute', List.of(Mark.create({ type: 'bold' })))
}

export const output = (
  <text>
    <b>Cat is Cute</b>
  </text>
)
