/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.delete()
}

export const input = (
  <value>
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
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <quote>
          <paragraph>
            word<cursor />another
          </paragraph>
        </quote>
      </quote>
    </document>
  </value>
)
