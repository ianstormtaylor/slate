/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.splitInline()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          <b>
            wo<cursor />rd
          </b>
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
          <b>wo</b>
        </link>
        <link>
          <b>
            <cursor />rd
          </b>
        </link>
      </paragraph>
    </document>
  </value>
)
