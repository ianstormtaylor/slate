/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.delete()
}

export const input = (
  <value>
    <document>
      <image>
        <anchor />{' '}<focus />
      </image>
    </document>
  </value>
)

export const output = (
  <value>
    <document />
    <selection
      anchorKey={null}
      anchorOffset={0}
      focusKey={null}
      focusOffset={0}
    />
  </value>
)
