
/** @jsx h */

import React from 'react'
import h from '../helpers/h'

export const rules = [
  {
    serialize(obj, children) {
      if (obj.kind == 'block' && obj.type == 'paragraph') {
        return React.createElement('p', {}, children)
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
        on<b>e</b>
      </paragraph>
    </document>
  </state>
)

export const output = `
<p>on<strong>e</strong></p>
`.trim()
