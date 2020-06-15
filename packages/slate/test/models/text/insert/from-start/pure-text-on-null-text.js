/** @jsx h */

import h from '../../../../helpers/h'

export const input = <text />

export default function(t) {
  return t.insertText(0, 'Cat is Cute')
}

export const output = <text>Cat is Cute</text>
