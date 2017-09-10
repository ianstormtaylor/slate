/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.insertFragment((
    <document>
      <quote>
        one
      </quote>
      <quote>
        two
      </quote>
      <quote>
        three
      </quote>
    </document>
  ))
}

export const input = (
  <state>
    <document>
      <paragraph>
        <cursor />word
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        one
      </paragraph>
      <quote>
        two
      </quote>
      <quote>
        threeword
      </quote>
    </document>
  </state>
)
