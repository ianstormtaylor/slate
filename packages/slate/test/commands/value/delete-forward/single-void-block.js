/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteForward()
}

export const input = (
  <value>
    
      <image>
        <cursor />{' '}
      </image>
    
  </value>
)

export const output = (
  <value>
    <document />
    <selection focused />
  </value>
)
