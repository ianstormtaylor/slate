/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.insertFragment((
    <document>
      <quote>
        <quote>
          one
        </quote>
        <quote>
          two
        </quote>
      </quote>
    </document>
  ))
}

export const input = (
  <state>
    <document>
      <paragraph>
        wo<cursor />rd
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        woone
      </paragraph>
      <quote>
        <quote>
          tword
        </quote>
      </quote>
    </document>
  </state>
)
