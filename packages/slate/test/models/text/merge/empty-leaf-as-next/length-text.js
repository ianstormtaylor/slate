/** @jsx h */

import h from '../../../../helpers/h'

export const input = [<i>Some</i>[0], <text />[0]]

export default function(texts) {
  return texts[0].mergeText(texts[1])
}

export const output = <i>Some</i>[0]
