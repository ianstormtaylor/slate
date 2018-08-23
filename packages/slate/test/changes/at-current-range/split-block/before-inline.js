/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.splitBlock()
}

export const input = (
  <value>
    <document>
      <paragraph>
        word<link href="website.com">
          <cursor />hyperlink
        </link>word
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        word<link href="website.com" />
      </paragraph>
      <paragraph>
        <link href="website.com">
          <cursor />hyperlink
        </link>word
      </paragraph>
    </document>
  </value>
)
