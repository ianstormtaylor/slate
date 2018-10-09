/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.wrapBlock({
    type: 'quote',
    data: { thing: 'value' },
  })
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />word
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote thing="value">
        <paragraph>
          <cursor />word
        </paragraph>
      </quote>
    </document>
  </value>
)
