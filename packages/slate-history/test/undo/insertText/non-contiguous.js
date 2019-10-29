/** @jsx h */

import { h } from '../../helpers'

export const run = editor => {
  editor.insertText('t')
  editor.flush()
  editor.move({ reverse: true })
  editor.insertText('w')
  editor.flush()
  editor.move({ reverse: true })
  editor.insertText('o')
}

export const input = (
  <value>
    <block>
      one<cursor />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      onew<cursor />t
    </block>
  </value>
)
