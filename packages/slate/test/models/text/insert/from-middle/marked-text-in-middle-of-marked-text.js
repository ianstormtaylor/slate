/** @jsx h */

import { Set } from 'immutable'
import h from '../../../../helpers/h'
import { Mark } from 'slate'

export const input = (
  <text>
    <b>CatCute</b>
  </text>
)

export default function(t) {
  return t.insertText(3, ' is ', Set.of(Mark.create('bold')))
}

export const output = (
  <text>
    <b>
      <b>Cat is Cute</b>
    </b>
  </text>
)
