/** @jsx h */

import React from 'react'
import h from '../helpers/h'

export const rules = [
  {
    serialize(obj, children) {
      if (obj.object == 'block' && obj.type == 'paragraph') {
        return React.createElement('p', {}, children)
      }

      if (obj.object == 'inline' && obj.type == 'link') {
        return React.createElement('a', {}, children)
      }
    },
  },
]

export const input = (
  <value>
    <document>
      <paragraph>
        <link>one</link>
      </paragraph>
    </document>
  </value>
)

export const output = `
<p><a>one</a></p>
`.trim()
