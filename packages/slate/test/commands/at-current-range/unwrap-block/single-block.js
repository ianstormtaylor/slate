/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.unwrapBlock('quote')
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>
          <cursor />word
        </paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <cursor />word
      </paragraph>
    </document>
  </value>
)
