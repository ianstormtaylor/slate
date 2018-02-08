/** @jsx h */

import React from 'react'
import h from '../helpers/h'

export const rules = [
  {
    serialize(obj, children) {
      if (obj.object == 'block' && obj.type == 'paragraph') {
        return React.createElement(
          'p',
          { 'data-thing': obj.data.get('thing') },
          children
        )
      }
    },
  },
]

export const input = (
  <value>
    <document>
      <paragraph thing="value">one</paragraph>
    </document>
  </value>
)

export const output = `
<p data-thing="value">one</p>
`.trim()
