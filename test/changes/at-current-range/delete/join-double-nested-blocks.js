/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.delete()
}

export const input = (
  <state>
    <document>
      <quote>
        <quote>
          <paragraph>
            word<anchor />
          </paragraph>
          <paragraph>
            <focus />another
          </paragraph>
        </quote>
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>
        <quote>
          <paragraph>
            word<cursor />another
          </paragraph>
        </quote>
      </quote>
    </document>
  </state>
)
