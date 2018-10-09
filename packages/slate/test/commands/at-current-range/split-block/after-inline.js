/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.splitBlock()
}

export const input = (
  <value>
    <document>
      <paragraph>
        word<link href="website.com">hyperlink</link>
        <cursor />word
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        word<link href="website.com">hyperlink</link>
      </paragraph>
      <paragraph>
        <cursor />word
      </paragraph>
    </document>
  </value>
)
