/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertText('a')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          <anchor />one
        </link>
        middle<focus />two
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <link>
          a<cursor />
        </link>
        two
      </paragraph>
    </document>
  </value>
)
