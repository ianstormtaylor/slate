/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.setMarkByKey(
    'a',
    0,
    2,
    {
      type: 'bold',
      data: { thing: 'value' },
    },
    {
      data: { thing: false },
    }
  )
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text key="a">
          <b thing="value">word</b>
        </text>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <b thing={false}>wo</b>
        <b thing="value">rd</b>
      </paragraph>
    </document>
  </value>
)
