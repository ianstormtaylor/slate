
import React from 'react'

export default {
  rules: [
    // the first one has no serialize()
    {},
    // the second has a serialize() that does not return anything
    {
      serialize(obj, children) {}
    },
    // then the real one
    {
      serialize(obj, children) {
        if (obj.kind == 'block' && obj.type == 'paragraph') {
          return <p>{children}</p>
        }
        if (obj.kind == 'inline' && obj.type == 'link') {
          return <a>{children}</a>
        }
      }
    }
  ]
}
