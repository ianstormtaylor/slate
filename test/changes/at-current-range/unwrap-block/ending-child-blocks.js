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
          one
        </paragraph>
        <paragraph>
          two
        </paragraph>
        <paragraph>
          three
        </paragraph>
        <paragraph>
          four
        </paragraph>
        <paragraph>
          <anchor />five
        </paragraph>
        <paragraph>
          <focus />six
        </paragraph>
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>
        <paragraph>
          one
        </paragraph>
        <paragraph>
          two
        </paragraph>
        <paragraph>
          three
        </paragraph>
        <paragraph>
          four
        </paragraph>
      </quote>
      <paragraph>
        <anchor />five
      </paragraph>
      <paragraph>
        <focus />six
      </paragraph>
    </document>
  </state>
)
