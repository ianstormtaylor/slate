
/** @jsx h */

import React from 'react'
import h from '../helpers/h'

export const rules = [
  {
    serialize(obj, children) {
      if (obj.kind == 'block' && obj.type == 'paragraph') {
        return React.createElement('p', {}, children)
      }
    }
  }
]

export const input = (
  <state>
    <document>
      <paragraph>
        one
      </paragraph>
    </document>
  </state>
)

export const output = `
<p>one</p>
`.trim()
