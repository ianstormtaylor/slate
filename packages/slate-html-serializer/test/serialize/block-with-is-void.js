/** @jsx h */

import React from 'react'
import h from '../helpers/h'

export const rules = [
  {
    serialize(obj, children) {
      if (obj.object == 'block' && obj.type == 'image') {
        return React.createElement('img')
      }
    },
  },
]

export const input = (
  <value>
    <document>
      <image />
    </document>
  </value>
)

export const output = `
<img/>
`.trim()
