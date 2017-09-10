/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.splitBlock()
}

export const input = (
  <state>
    <document>
      <paragraph>
        word<link href="website.com">hyperlink</link><cursor />word
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        word<link href="website.com">hyperlink</link>
      </paragraph>
      <paragraph>
        <cursor />word
      </paragraph>
    </document>
  </state>
)
