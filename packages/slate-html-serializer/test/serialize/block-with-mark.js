/** @jsx h */

import React from 'react'
import h from '../helpers/h'

export const rules = [
  {
    serialize(obj, children) {
      if (obj.object == 'block' && obj.type == 'paragraph') {
        return React.createElement('p', {}, children)
      }

      if (obj.object == 'mark' && obj.type == 'bold') {
        return React.createElement('strong', {}, children)
      }
    },
  },
]

export const input = (
  <value>
    <document>
      <paragraph>
        on<b>e</b>
      </paragraph>
    </document>
  </value>
)

export const output = `
<p>on<strong>e</strong></p>
`.trim()
