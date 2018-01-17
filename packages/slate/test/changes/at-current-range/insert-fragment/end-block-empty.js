/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.insertFragment((
    <document>
      <quote>
        fragment
      </quote>
    </document>
  ))
}

export const input = (
  <value>
    <document>
      <paragraph>
        <anchor />word
      </paragraph>
      <paragraph>
        <focus />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        fragment<cursor />
      </quote>
    </document>
  </value>
)
