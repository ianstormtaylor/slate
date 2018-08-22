/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertInline('emoji')
}

export const input = (
  <value>
    <document>
      <paragraph>
        word<cursor />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        word<emoji>
          <cursor />
        </emoji>
      </paragraph>
    </document>
  </value>
)
