/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.removeTextByKey('a', 2, 1)
}

export const input = (
  <state>
    <document>
      <paragraph>
        <text key="a"><anchor />word<focus /></text>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <anchor />wod<focus />
      </paragraph>
    </document>
  </state>
)
