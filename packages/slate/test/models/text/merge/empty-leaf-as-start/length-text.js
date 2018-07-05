/** @jsx h */

import h from '../../../../helpers/h'

export const input = [<b />[0], <text>Some</text>[0]]

export default function(texts) {
  return texts[0].mergeText(texts[1])
}

export const output = <text>Some</text>[0]
