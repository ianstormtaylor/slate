/** @jsx h */

import h from '../../../../helpers/h'

export const input = (
  <b>
    Cat is <i>Cute</i>
  </b>
)[0]

export default function(t) {
  return t.removeText(0, t.text.length)
}

export const output = <b />[0]
