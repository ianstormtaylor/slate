/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.deleteBackward()
}

export const input = (
  <value>
    <document>
      <image>
        <cursor />{' '}
      </image>
    </document>
  </value>
)

export const output = (
  <value>
    <document />
    <selection focused />
  </value>
)
