
import React from 'react'

export default {
  rules: [
    // An empty rule that does not define `serialize`.
    {},
    // A second rule that defines `serialize` but doesn't handle the cases.
    {
      serialize(obj, children) {}
    },
    // The rule that actually matches.
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
