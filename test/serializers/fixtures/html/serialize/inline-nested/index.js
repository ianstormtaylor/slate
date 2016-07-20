
import React from 'react'

export default {
  rules: [
    {
      serialize(obj, children) {
        if (obj.kind == 'block' && obj.type == 'paragraph') {
          return <p>{children}</p>
        }
        if (obj.kind == 'inline' && obj.type == 'link') {
          return <a>{children}</a>
        }
        if (obj.kind == 'inline' && obj.type == 'hashtag') {
          return <span className="hashtag">{children}</span>
        }
      }
    }
  ]
}
