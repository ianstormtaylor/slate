/** @jsx h */

import h from '../../../../helpers/h'

export const input = <text>CatCute</text>[0]

export default function(t) {
  return t.insertText(3, ' is ')
}

export const output = <text>Cat is Cute</text>[0]
