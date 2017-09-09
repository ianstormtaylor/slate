
/** @jsx sugar */

import React from 'react'
import sugar from '../../../helpers/sugar'

export const rules = [
  {
    serialize(obj, children) {
      if (obj.kind == 'block' && obj.type == 'image') {
        return React.createElement('img')
      }
    }
  }
]

export const input = (
  <state>
    <document>
      <image />
    </document>
  </state>
)

export const output = `
<img/>
`.trim()
