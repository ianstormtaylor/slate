/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.insertText(' a few words ')
}

export const input = (
  <value>
    <block>
      w<cursor />
      ord
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      w a few words <cursor />
      ord
    </block>
  </value>
)
