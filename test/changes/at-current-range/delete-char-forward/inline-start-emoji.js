/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.deleteCharForward()
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link><cursor />📛word</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link><cursor />word</link>
      </paragraph>
    </document>
  </state>
)
