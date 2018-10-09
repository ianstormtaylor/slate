/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertInline('emoji')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />word
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <emoji>
          <cursor />
        </emoji>word
      </paragraph>
    </document>
  </value>
)
