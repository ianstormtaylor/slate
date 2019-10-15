/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  const { value: { document, selection } } = editor
  const [[node]] = document.texts()

  const next = selection.setProperties({
    anchor: {
      path: [0, 0],
      key: node.key,
      offset: 0,
    },
    focus: {
      path: [0, 0],
      key: node.key,
      offset: node.text.length,
    },
  })

  editor.select(next)
}

export const input = (
  <value>
    
      <block>
        <cursor />one
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <anchor />one<focus />
      </block>
    
  </value>
)
