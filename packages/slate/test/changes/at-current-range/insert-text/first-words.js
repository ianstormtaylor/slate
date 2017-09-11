/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.insertText('a few words')
}

export const input = (
  <state>
    <document>
      <paragraph><cursor />word</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        a few words<cursor />word
      </paragraph>
    </document>
  </state>
)
