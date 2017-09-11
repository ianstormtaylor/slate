/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.insertFragment((
    <document>
      <quote>
        fragment
      </quote>
    </document>
  ))
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
      <paragraph>
        wofragment<cursor />other
      </paragraph>
    </document>
  </state>
)
