/** @jsx h */

import React from 'react'
import h from '../helpers/h'

export const rules = [
  {
    serialize(obj, children) {
      if (obj.object == 'block' && obj.type == 'paragraph') {
        return React.createElement('p', {}, children)
      }

      if (obj.object == 'inline' && obj.type == 'emoji') {
        return React.createElement('img')
      }
    },
  },
]

export const input = (
  <value>
    <document>
      <paragraph>
        <emoji />
      </paragraph>
    </document>
  </value>
)

export const output = `
<p><img/></p>
`.trim()
