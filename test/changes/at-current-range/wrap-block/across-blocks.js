/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.wrapBlock('quote')
}

export const input = (
  <state>
    <document>
      <paragraph>
        wo<anchor />rd
      </paragraph>
      <paragraph>
        an<focus />other
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>
        <paragraph>
          wo<anchor />rd
        </paragraph>
        <paragraph>
          an<focus />other
        </paragraph>
      </quote>
    </document>
  </state>
)
