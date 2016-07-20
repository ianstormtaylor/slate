
import React from 'react'

export default {
  rules: [
    {
      serialize(obj, children) {
        if (obj.kind == 'block' && obj.type == 'image') {
          return <img />
        }
      }
    }
  ]
}
