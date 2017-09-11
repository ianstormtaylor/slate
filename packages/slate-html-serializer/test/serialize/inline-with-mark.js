
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

      if (obj.kind == 'mark' && obj.type == 'bold') {
        return React.createElement('strong', {}, children)
      }
    }
  }
]

export const input = (
  <state>
    <document>
      <paragraph>
        <link>
          on<b>e</b>
        </link>
      </paragraph>
    </document>
  </state>
)

export const output = `
<p><a>on<strong>e</strong></a></p>
`.trim()
