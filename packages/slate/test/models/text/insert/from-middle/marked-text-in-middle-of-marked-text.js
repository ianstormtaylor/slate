/** @jsx h */

import { Set } from 'immutable'
import h from '../../../../helpers/h'
import { Mark } from 'slate'

export const input = <b>CatCute</b>[0]

export default function(t) {
  return t.insertText(3, ' is ', Set.of(Mark.create('bold')))
}

export const output = (
  <b>
    <b>Cat is Cute</b>
  </b>
)[0]
