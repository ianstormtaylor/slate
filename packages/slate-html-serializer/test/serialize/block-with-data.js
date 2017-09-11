
/** @jsx h */

import React from 'react'
import h from '../helpers/h'

export const rules = [
  {
    serialize(obj, children) {
      if (obj.kind == 'block' && obj.type == 'paragraph') {
        return React.createElement('p', { 'data-thing': obj.data.get('thing') }, children)
      }
    }
  }
]

export const input = (
  <state>
    <document>
      <paragraph thing="value">
        one
      </paragraph>
    </document>
  </state>
)

export const output = `
<p data-thing="value">one</p>
`.trim()
