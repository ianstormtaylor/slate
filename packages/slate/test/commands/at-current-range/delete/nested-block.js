/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.delete()
}

export const input = (
  <value>
    <document>
      <paragraph>
        wo<anchor />rd
      </paragraph>
      <paragraph>
        <paragraph>middle</paragraph>
        <paragraph>
          an<focus />other
        </paragraph>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        wo<cursor />other
      </paragraph>
    </document>
  </value>
)
