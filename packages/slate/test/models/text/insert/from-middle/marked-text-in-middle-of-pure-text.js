/** @jsx h */

import { Set } from 'immutable'
import h from '../../../../helpers/h'
import { Mark } from 'slate'

export const input = <text>CatCute</text>[0]

export default function(t) {
  return t.insertText(3, ' is ', Set.of(Mark.create('bold')))
}

export const output = (
  <text>
    Cat<b> is </b>Cute
  </text>
)[0]
