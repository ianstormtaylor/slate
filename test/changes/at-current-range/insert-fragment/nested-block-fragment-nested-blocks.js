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
      <quote>
        <paragraph>
          wo<cursor />rd
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
          woone
        </paragraph>
        <quote>
          <quote>
            tword
          </quote>
        </quote>
      </quote>
    </document>
  </state>
)
