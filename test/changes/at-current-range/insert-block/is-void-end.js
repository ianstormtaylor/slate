/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.insertBlock('quote')
}

export const input = (
  <state>
    <document>
      <image>
        {' '}<cursor />
      </image>
      <paragraph>
        text
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <image />
      <quote>
        <cursor />
      </quote>
      <paragraph>
        text
      </paragraph>
    </document>
  </state>
)
