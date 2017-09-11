
/** @jsx h */

import React from 'react'
import h from '../helpers/h'

export const rules = [
  {
    serialize(obj, children) {
      if (obj.kind == 'block' && obj.type == 'image') {
        return React.createElement('img')
      }
    }
  }
]

export const input = (
  <state>
    <document>
      <image />
    </document>
  </state>
)

export const output = `
<img/>
`.trim()
