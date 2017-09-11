/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.unwrapBlock('quote')
}

export const input = (
  <state>
    <document>
      <quote>
        <paragraph>
          <anchor />one
        </paragraph>
        <paragraph>
          <focus />two
        </paragraph>
        <paragraph>
          three
        </paragraph>
        <paragraph>
          four
        </paragraph>
        <paragraph>
          five
        </paragraph>
        <paragraph>
          six
        </paragraph>
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <anchor />one
      </paragraph>
      <paragraph>
        <focus />two
      </paragraph>
      <quote>
        <paragraph>
          three
        </paragraph>
        <paragraph>
          four
        </paragraph>
        <paragraph>
          five
        </paragraph>
        <paragraph>
          six
        </paragraph>
      </quote>
    </document>
  </state>
)
