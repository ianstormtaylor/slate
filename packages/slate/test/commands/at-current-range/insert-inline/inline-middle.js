/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertInline('emoji')
}

export const input = (
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

export const output = (
  <value>
    <document>
      <paragraph>
        <link>
          wo<emoji>
            <cursor />
          </emoji>rd
        </link>
      </paragraph>
    </document>
  </value>
)
