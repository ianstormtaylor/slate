/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    
      <image>
        <anchor /> <focus />
      </image>
    
  </value>
)

export const output = (
  <value>
    <document />
    <selection focused />
  </value>
)
