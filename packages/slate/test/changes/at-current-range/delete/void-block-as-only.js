/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.delete()
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
    <document />
    <selection
      anchorKey={null}
      anchorOffset={0}
      focusKey={null}
      focusOffset={0}
    />
  </state>
)
