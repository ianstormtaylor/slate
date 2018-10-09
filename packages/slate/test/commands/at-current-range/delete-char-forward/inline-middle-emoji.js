/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.deleteCharForward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          wo<cursor />📛rd
        </link>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <link>
          wo<cursor />rd
        </link>
      </paragraph>
    </document>
  </value>
)
