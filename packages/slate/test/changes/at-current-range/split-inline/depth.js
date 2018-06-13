/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.splitInline(1)
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          <link>
            wo<cursor />rd
          </link>
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
          <link>wo</link>
          <link>
            <cursor />rd
          </link>
        </link>
      </paragraph>
    </document>
  </value>
)
