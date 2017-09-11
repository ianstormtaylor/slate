
/** @jsx h */

import React from 'react'
import h from '../helpers/h'

export const rules = [
  {
    serialize(obj, children) {
      if (obj.kind != 'block') return
      switch (obj.type) {
        case 'paragraph': return React.createElement('p', {}, children)
        case 'quote': return React.createElement('blockquote', {}, children)
      }
    }
  }
]

export const input = (
  <state>
    <document>
      <quote>
        <paragraph>
          one
        </paragraph>
      </quote>
    </document>
  </state>
)

export const output = `
<blockquote><p>one</p></blockquote>
`.trim()
