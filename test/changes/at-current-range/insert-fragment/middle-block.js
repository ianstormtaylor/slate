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
        wofragment<cursor />rd
      </paragraph>
    </document>
  </state>
)
