/** @jsx h */

import React from 'react'
import h from '../helpers/h'

export const rules = [
  {
    serialize(obj, children) {
      if (obj.object == 'block' && obj.type == 'paragraph') {
        return React.createElement('p', {}, children)
      }

      if (obj.object == 'inline' && obj.type == 'link') {
        return React.createElement('a', {}, children)
      }

      if (obj.object == 'inline' && obj.type == 'comment') {
        return null
      }

      if (obj.object == 'block' && obj.type == 'quote') {
        return null
      }
    },
  },
]

export const input = (
  <value>
    <document>
      <paragraph>
        Something <comment>skipped</comment> Here
      </paragraph>
      <quote>Skipped</quote>
    </document>
  </value>
)

export const output = `
<p>Something  Here</p>
`.trim()
