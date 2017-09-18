/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.deleteForward()
}

export const input = (
  <state>
    <document>
      <image>
        <cursor />{' '}
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
