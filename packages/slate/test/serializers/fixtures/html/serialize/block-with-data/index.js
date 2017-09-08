
import React from 'react'

export default {
  rules: [
    {
      serialize(obj, children) {
        if (obj.kind == 'block' && obj.type == 'paragraph') {
          return <p data-key={obj.data.get('key')}>{children}</p>
        }
      }
    }
  ]
}
