/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.splitBlock(Infinity)
}

export const input = (
  <state>
    <document>
      <paragraph>
        <paragraph>
          <paragraph>wo<cursor />rd</paragraph>
        </paragraph>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <paragraph>
          <paragraph>wo</paragraph>
        </paragraph>
      </paragraph>
      <paragraph>
        <paragraph>
          <paragraph><cursor />rd</paragraph>
        </paragraph>
      </paragraph>
    </document>
  </state>
)
