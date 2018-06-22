/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.replaceMark('italic', {
    type: 'bold',
    data: { thing: 'value' },
  })
}

export const input = (
  <value>
    <document>
      <paragraph>
        <anchor />
        <i>w</i>
        <focus />ord
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <anchor />
        <b thing="value">w</b>
        <focus />ord
      </paragraph>
    </document>
  </value>
)
