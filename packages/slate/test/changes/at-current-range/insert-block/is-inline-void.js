/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertBlock('quote')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <emoji>
          <cursor />
        </emoji>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <emoji />
      </paragraph>
      <quote>
        <cursor />
      </quote>
      <paragraph />
    </document>
  </value>
)
