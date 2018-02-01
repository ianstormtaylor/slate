/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.removeMark({
    type: 'bold',
    data: { thing: 'value' },
  })
}

export const input = (
  <value>
    <document>
      <paragraph>
        <b thing="value">
          <anchor />w<focus />
        </b>ord
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <anchor />w<focus />ord
      </paragraph>
    </document>
  </value>
)
