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
          <anchor />three
        </paragraph>
        <paragraph>
          <focus />four
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
      <quote>
        <paragraph>
          one
        </paragraph>
        <paragraph>
          two
        </paragraph>
      </quote>
      <paragraph>
        <anchor />three
      </paragraph>
      <paragraph>
        <focus />four
      </paragraph>
      <quote>
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
