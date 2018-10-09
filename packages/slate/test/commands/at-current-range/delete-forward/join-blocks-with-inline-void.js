/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.deleteForward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        word<cursor />
      </paragraph>
      <paragraph>
        <emoji />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        word<cursor />
        <emoji />
      </paragraph>
    </document>
  </value>
)
