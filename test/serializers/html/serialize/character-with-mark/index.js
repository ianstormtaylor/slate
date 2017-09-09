
import React from 'react'

export default {
  rules: [
    {
      serialize(obj, children) {
        if (obj.kind == 'block' && obj.type == 'paragraph') {
          return <p>{children}</p>
        }
        if (obj.kind == 'mark' && obj.type == 'bold') {
          return <strong>{children}</strong>
        }
      }
    }
  ]
}
