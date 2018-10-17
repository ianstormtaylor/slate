/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertInline('emoji')
}

export const input = (
  <value>
    <document>
      <paragraph>
        wo<cursor />rd
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        wo<emoji>
          <cursor />
        </emoji>rd
      </paragraph>
    </document>
  </value>
)
