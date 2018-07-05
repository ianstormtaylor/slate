/** @jsx h */

import h from '../../../../helpers/h'

export const input = <text />[0]

export default function(t) {
  return t.insertText(1, 'Cat is Cute')
}

export const output = <text>Cat is Cute</text>[0]
