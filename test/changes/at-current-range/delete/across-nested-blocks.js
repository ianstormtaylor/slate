/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.delete()
}

export const input = (
  <state>
    <document>
      <quote>
        <paragraph>
          one<anchor />
        </paragraph>
        <paragraph>
          two
        </paragraph>
      </quote>
      <quote>
        <paragraph>
          <focus />three
        </paragraph>
        <paragraph>
          four
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
          one<cursor />three
        </paragraph>
      </quote>
      <quote>
        <paragraph>
          four
        </paragraph>
      </quote>
    </document>
  </state>
)
