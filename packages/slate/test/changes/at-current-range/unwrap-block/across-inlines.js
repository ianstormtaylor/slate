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
          <link>
            wo<anchor />rd
          </link>
        </paragraph>
        <paragraph>
          <link>
            an<focus />other
          </link>
        </paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <link>
          wo<anchor />rd
        </link>
      </paragraph>
      <paragraph>
        <link>
          an<focus />other
        </link>
      </paragraph>
    </document>
  </value>
)
