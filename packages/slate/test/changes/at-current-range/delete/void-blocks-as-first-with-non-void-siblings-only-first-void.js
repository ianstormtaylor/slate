/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.delete()
}

export const input = (
  <state>
    <document>
      <image>
        <anchor />{' '}
      </image>
      <image>
        <focus />{' '}
      </image>
      <paragraph>
        one
      </paragraph>
      <paragraph>
        two
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <cursor />one
      </paragraph>
      <paragraph>
        two
      </paragraph>
    </document>
  </state>
)
