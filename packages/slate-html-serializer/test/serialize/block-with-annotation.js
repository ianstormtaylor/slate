/** @jsx h */

import React from 'react'
import h from '../helpers/h'

export const rules = [
  {
    serialize(obj, children) {
      if (obj.object === 'block' && obj.type === 'paragraph') {
        return React.createElement('p', {}, children)
      }

      if (obj.object === 'annotation' && obj.type === 'highlight') {
        return React.createElement('strong', {}, children)
      }
    },
  },
]

export const input = (
  <value>
    <document>
      <paragraph>
        on
        <highlight key="a" />e
      </paragraph>
      <paragraph>
        tw
        <highlight key="a" />o
      </paragraph>
    </document>
  </value>
)

export const output = `
<p>on<strong>e</strong></p><p><strong>tw</strong>o</p>
`.trim()
