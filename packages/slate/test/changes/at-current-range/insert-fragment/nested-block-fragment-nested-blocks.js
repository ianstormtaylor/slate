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
  <value>
    <document>
      <quote>
        <paragraph>
          wo<cursor />rd
        </paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>
          woone
        </paragraph>
        <quote>
          <quote>
            <cursor />tword
          </quote>
        </quote>
      </quote>
    </document>
  </value>
)
