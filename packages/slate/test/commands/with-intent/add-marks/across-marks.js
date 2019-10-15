/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.addMarks(['underline'])
}

export const input = (
  <value>
    
      <block>
        Some{' '}
        <b>
          <anchor />bold
        </b>{' '}
        and some{' '}
        <i>
          ita<focus />lic
        </i>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        Some{' '}
        <u>
          <b>
            <anchor />
            bold
          </b>
        </u>
        <u> and some </u>
        <u>
          <i>ita</i>
        </u>
        <i>
          <focus />lic
        </i>
      </block>
    
  </value>
)
