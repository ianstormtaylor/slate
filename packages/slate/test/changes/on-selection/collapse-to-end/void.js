/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.collapseToEnd()
}

export const input = (
  <state>
    <document>
      <image>
        <anchor />{' '}<focus />
      </image>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <image>
        {' '}<cursor />
      </image>
    </document>
  </state>
)
