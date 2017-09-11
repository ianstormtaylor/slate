/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.unwrapBlock('quote')
}

export const input = (
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

export const output = (
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
