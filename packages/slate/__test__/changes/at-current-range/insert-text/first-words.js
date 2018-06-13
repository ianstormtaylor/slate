/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertText('a few words')
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
        a few words<cursor />word
      </paragraph>
    </document>
  </value>
)
