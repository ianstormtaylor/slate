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
          word<cursor />
        </link>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <link>word</link>
        <link>
          <cursor />
        </link>
      </paragraph>
    </document>
  </value>
)
