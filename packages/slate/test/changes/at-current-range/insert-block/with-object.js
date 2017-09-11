/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.insertBlock({ type: 'quote' })
}

export const input = (
  <state>
    <document>
      <paragraph>
        <cursor />word
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>
        <cursor />
      </quote>
      <paragraph>
        word
      </paragraph>
    </document>
  </state>
)
