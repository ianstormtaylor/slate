/** @jsx h */

import React from 'react'
import h from '../helpers/h'

export const rules = [
  {
    serialize(obj, children) {
      if (obj.object != 'block') return

      switch (obj.type) {
        case 'paragraph':
          return React.createElement('p', {}, children)
        case 'quote':
          return React.createElement('blockquote', {}, children)
      }
    },
  },
]

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>one</paragraph>
      </quote>
    </document>
  </value>
)

export const output = `
<blockquote><p>one</p></blockquote>
`.trim()
