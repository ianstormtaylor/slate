/** @jsx h */

import h from '../../../../helpers/h'

export const input = <text>CatCute</text>

export default function(t) {
  return t.insertText(3, ' is ')
}

export const output = <text>Cat is Cute</text>
