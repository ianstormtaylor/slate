
/** @jsx h */

import React from 'react'
import h from '../helpers/h'

export const rules = [
  {
    serialize(obj, children) {
      if (obj.kind == 'block' && obj.type == 'paragraph') {
        return React.createElement('p', {}, children)
      }

      if (obj.kind == 'inline' && obj.type == 'link') {
        return React.createElement('a', {}, children)
      }
    }
  }
]

export const input = (
  <state>
    <document>
      <paragraph>
        <link>
          one
        </link>
      </paragraph>
    </document>
  </state>
)

export const output = `
<p><a>one</a></p>
`.trim()
