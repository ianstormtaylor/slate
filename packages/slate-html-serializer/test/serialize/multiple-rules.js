/** @jsx h */

import React from 'react'
import h from '../helpers/h'

export const rules = [
  {},
  {
    serialize(obj, children) {},
  },
  {
    serialize(obj, children) {
      if (obj.object == 'block' && obj.type == 'paragraph') {
        return React.createElement('p', {}, children)
      }
    },
  },
]

export const input = (
  <value>
    <document>
      <paragraph>one</paragraph>
    </document>
  </value>
)

export const output = `
<p>one</p>
`.trim()
