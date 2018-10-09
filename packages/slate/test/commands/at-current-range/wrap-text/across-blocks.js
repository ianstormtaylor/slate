/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.wrapText('[[', ']]')
}

export const input = (
  <value>
    <document>
      <paragraph>
        wo<anchor />rd
      </paragraph>
      <paragraph>
        an<focus />other
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        wo[[<anchor />rd
      </paragraph>
      <paragraph>
        an<focus />]]other
      </paragraph>
    </document>
  </value>
)
