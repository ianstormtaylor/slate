/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.insertBlock('quote')
}

export const input = (
  <state>
    <document>
      <paragraph>
        wo<cursor />rd
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        wo
      </paragraph>
      <quote>
        <cursor />
      </quote>
      <paragraph>
        rd
      </paragraph>
    </document>
  </state>
)
