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

      if (obj.object == 'inline' && obj.type == 'hashtag') {
        return React.createElement('span', {}, children)
      }
    },
  },
]

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          <hashtag>one</hashtag>
        </link>
      </paragraph>
    </document>
  </value>
)

export const output = `
<p><a><span>one</span></a></p>
`.trim()
