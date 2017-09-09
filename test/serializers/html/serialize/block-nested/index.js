
import React from 'react'

export default {
  rules: [
    {
      serialize(obj, children) {
        if (obj.kind != 'block') return

        switch (obj.type) {
          case 'paragraph': return <p>{children}</p>
          case 'quote': return <blockquote>{children}</blockquote>
        }
      }
    }
  ]
}
