/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.wrapText('[[', ']]')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          wo<anchor />rd
        </link>
        <link>
          an<focus />other
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
          wo[[<anchor />rd
        </link>
        <link>
          an<focus />]]other
        </link>
      </paragraph>
    </document>
  </value>
)
