
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

      if (obj.kind == 'inline' && obj.type == 'hashtag') {
        return React.createElement('span', {}, children)
      }
    }
  }
]

export const input = (
  <state>
    <document>
      <paragraph>
        <link>
          <hashtag>
            one
          </hashtag>
        </link>
      </paragraph>
    </document>
  </state>
)

export const output = `
<p><a><span>one</span></a></p>
`.trim()
