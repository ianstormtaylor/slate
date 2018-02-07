/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.deleteCharForward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        wo<cursor />rd
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        wo<cursor />d
      </paragraph>
    </document>
  </value>
)
