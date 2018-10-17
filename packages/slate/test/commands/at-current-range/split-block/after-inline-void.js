/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.splitBlock()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one<emoji />
        <cursor />two
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one<emoji />
      </paragraph>
      <paragraph>
        <cursor />two
      </paragraph>
    </document>
  </value>
)
