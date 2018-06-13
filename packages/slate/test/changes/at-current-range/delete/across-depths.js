/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.delete()
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>
          one<anchor />
        </paragraph>
      </quote>
      <paragraph>
        <focus />two
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>
          one<cursor />two
        </paragraph>
      </quote>
    </document>
  </value>
)
